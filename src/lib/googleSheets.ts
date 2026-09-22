type RsvpSheetPayload = {
  type: "rsvp";
  responseId: string;
  fullName: string;
  attending: boolean;
  additionalGuests: number;
  additionalGuestNames: string;
};

type WishSheetPayload = {
  type: "wish";
  responseId: string;
  fullName: string;
  message: string;
};

type SheetPayload = RsvpSheetPayload | WishSheetPayload;

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzYoFdbh-qsChSZjOYPUKToCozlkSxFB97Op-hWMFsjsR3Ph2bdumQ3xk3tUZwJ5Lsg/exec";

export async function sendToGoogleSheets(payload: SheetPayload) {
  await fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ ...payload, website: "" }),
  });
}
