/**
 * @returns {AsyncGenerator<string, void, void>}
 */
export default async function* index() {
  yield `<html>
  <head><title>Test Streaming</title></head>
  <body><h1>Users</h1>
  `;
  const res = await fetch("http://external.test/api/data.json");
  const data = await res.json();
  let timeout;
  try {
    for (const user of data.users) {
      await new Promise((resolve) => (timeout = setTimeout(resolve, 200)));
      yield `<h2>${user.profile.name}</h2> <p>${user.profile.about}</p>`;
    }
  } finally {
    if (timeout) clearTimeout(timeout);
  }
  yield `</body></html>`;
}
