import { google } from "googleapis";
import {
    getGoogleAuthURL,
    getTokensFromCode,
    listGoogleEvents,
    createGoogleEvent
} from "../services/google-calendar.js"

let savedTokens = null; // nanti lu simpan ke DB kalau mau multi-user

export function googleLogin(req, res) {
    return res.redirect(getGoogleAuthURL());
}

export async function googleRedirect(req, res) {
    try {
        const code = req.query.code;
    
        const tokens = await getTokensFromCode(code);
        savedTokens = tokens;
        const response =  res.json({
            message: "Google Calendar connected",
            tokens,
        })
        console.log(response)        
        return res.redirect(`${process.env.PUBLIC_API_BASE_URL}/dashboard/reminder/google-calendar?connected=true`)
    } catch (error) {
        console.error("Google redirect error: ", error)
        return res.redirect(`${process.env.PUBLIC_API_BASE_URL}/dashboard/reminder/google-calendar?connected=false`)
    }
}

export async function getEvents(req, res) {
    if (!savedTokens) return res.status(401).json({ message: "Not connected" });

    const events = await listGoogleEvents(savedTokens);
    res.json(events);
}

export async function addEvent(req, res) {
    if (!savedTokens) return res.status(401).json({ message: "Not connected" });

    const newEvent = await createGoogleEvent(savedTokens, req.body);
    res.json(newEvent);
}

export const getGoogleEvents = async (req, res) => {
    try {
        if (!savedTokens) {
            return res.status(401).json({ message: "Not connected" });
        }

        const calendarId = "unrnecar14d9pul6k80o905sbf8pr5ta@import.calendar.google.com"

        const auth = new google.auth.OAuth2();
        auth.setCredentials(savedTokens);

        const calendar = google.calendar({ version: "v3", auth });

        const response = await calendar.events.list({
            calendarId,
            singleEvents: true,
            orderBy: "startTime",
        });

        res.json(response.data.items);

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Failed to get events" });
    }
}
