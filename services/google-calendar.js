import { google } from "googleapis";

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/api/google/redirect"
  );
}

export function getGoogleAuthURL() {
  const oauth2Client = createOAuthClient();

  const scopes = ["https://www.googleapis.com/auth/calendar"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
}

export async function getTokensFromCode(code) {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function listGoogleEvents(token) {
  const auth = createOAuthClient();
  auth.setCredentials(token);

  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  return res.data.items;
}

export async function createGoogleEvent(token, eventData) {
  const auth = createOAuthClient();
  auth.setCredentials(token);
  
  const calendar = google.calendar({ version: "v3", auth });

  const result = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: eventData.title,
      description: eventData.description || "",
      start: { dateTime: eventData.start },
      end: { dateTime: eventData.end },
    },
  });

  return result.data;
}

export const getGoogleCalendars = async (req, res) => {
  try {
    const { access_token } = req.query;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.calendarList.list();

    res.json({
      calendars: response.data.items
    });

  } catch (error) {
    console.error("Error fetching calendars:", error);
    res.status(500).json({ error: "Failed to get calendars" });
  }
}