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

export async function getQuestionsByID(id) {
  const response = await fetch(BASEURL + "/questions/" + id);
  const s = await response.json();
  if (response.ok) {
    return s;
  } else {
    throw s;
  }
}

export async function getRepliesByID(id) {
  const response = await fetch(BASEURL + "/admin/replies/" + id);
  const r = await response.json();
  if (response.ok) {
    return r;
  } else {
    throw r;
  }
}

export async function getAdminSurveys() {
  const response = await fetch(BASEURL + "/admin/surveys");
  const s = await response.json();
  if (response.ok) {
    return s;
  } else {
    throw s;
  }
}

export async function createSurvey(s) {
  const response = await fetch(BASEURL + "/admin/surveys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(s),
  });

  if (response.ok) {
    return null;
  } else {
    throw response;
  }
}

export async function sendReply(r) {
  const response = await fetch(BASEURL + "/replies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(r),
  });

  if (response.ok) {
    return null;
  } else {
    throw response;
  }
}

/* User Login API */

export async function logIn(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
}

export async function logOut() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

export async function getUserInfo() {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + "/sessions/current")
      .then((response) => {
        if (response.ok) {
          response.json().then((obj) => resolve(obj));
        } else {
          response.json().then((err) => reject(err));
        }
      })
      .catch(() => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      });
  });
}
