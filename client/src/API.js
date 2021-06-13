/**
 * All the API calls
 */

const BASEURL = "/api";

export async function getAllSurveys() {
  const response = await fetch(BASEURL + "/surveys");
  const s = await response.json();
  if (response.ok) {
    return s;
  } else {
    throw s;
  }
}

export async function createSurvey(s) {
  const response = await fetch(BASEURL + "/surveys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(s),
  });

  if (response.ok) {
    return null;
  } else {
    throw s;
  }
}
