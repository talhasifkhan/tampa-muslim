import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var is not set");
  }
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
}

function getSpreadsheetId(): string {
  const id = process.env.SPREADSHEET_ID;
  if (!id) {
    throw new Error("SPREADSHEET_ID env var is not set");
  }
  return id;
}

/**
 * Reads all rows from the sheet and returns them as an array of objects.
 * First row is treated as headers.
 */
async function readSheet(): Promise<Record<string, string>[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1",
  });

  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || "";
    });
    return obj;
  });
}

/**
 * Finds the 1-based row index for a masjid by name.
 * Returns -1 if not found.
 */
async function findRowIndex(masjidName: string): Promise<number> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:A",
  });

  const rows = res.data.values;
  if (!rows) return -1;

  // Find header row to locate masjid_name column
  const headerRow = rows[0];
  const nameColIndex = headerRow.indexOf("masjid_name");
  if (nameColIndex === -1) {
    // If column A doesn't have the header, re-read full headers
    const fullRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!1:1",
    });
    const fullHeaders = fullRes.data.values?.[0] || [];
    const fullNameIdx = fullHeaders.indexOf("masjid_name");
    if (fullNameIdx === -1) return -1;

    const colRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Sheet1!${columnLetter(fullNameIdx)}:${columnLetter(fullNameIdx)}`,
    });
    const colValues = colRes.data.values || [];
    for (let i = 1; i < colValues.length; i++) {
      if (colValues[i]?.[0]?.trim() === masjidName.trim()) {
        return i + 1; // 1-based row
      }
    }
    return -1;
  }

  for (let i = 1; i < rows.length; i++) {
    if (rows[i]?.[0]?.trim() === masjidName.trim()) {
      return i + 1; // 1-based row
    }
  }
  return -1;
}

function columnLetter(index: number): string {
  let letter = "";
  let i = index;
  while (i >= 0) {
    letter = String.fromCharCode((i % 26) + 65) + letter;
    i = Math.floor(i / 26) - 1;
  }
  return letter;
}

/**
 * Updates prayer times for a specific masjid in the Google Sheet.
 * Only updates the prayer time columns and last_updated.
 */
export async function updatePrayerTimes(
  masjidName: string,
  times: Record<string, string>
): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = getSpreadsheetId();

  // Read headers to find column indices
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!1:1",
  });
  const headers = headerRes.data.values?.[0] || [];

  // Find the row for this masjid
  const rowIndex = await findRowIndex(masjidName);
  if (rowIndex === -1) {
    console.warn(`Masjid "${masjidName}" not found in sheet — skipping`);
    return;
  }

  // Build update requests for each prayer time column
  const updates: { range: string; values: string[][] }[] = [];

  for (const [key, value] of Object.entries(times)) {
    const colIndex = headers.indexOf(key);
    if (colIndex === -1) continue;
    const cell = `Sheet1!${columnLetter(colIndex)}${rowIndex}`;
    updates.push({ range: cell, values: [[value]] });
  }

  // Update last_updated column
  const lastUpdatedCol = headers.indexOf("last_updated");
  if (lastUpdatedCol !== -1) {
    const now = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const cell = `Sheet1!${columnLetter(lastUpdatedCol)}${rowIndex}`;
    updates.push({ range: cell, values: [[`${now} (auto)`]] });
  }

  if (updates.length === 0) {
    console.warn(`No columns to update for "${masjidName}"`);
    return;
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: updates,
    },
  });
}
