// Prüft das PAL-Passwort serverseitig, damit es nicht mehr als Klartext im
// Browser-Bundle liegt (wie zuvor in lib/palConfig.js).
export async function POST(request) {
  const { password } = await request.json();
  const correctPassword = process.env.PAL_PASSWORD;

  if (!correctPassword) {
    return Response.json(
      { error: "PAL-Login ist nicht eingerichtet (PAL_PASSWORD fehlt in .env.local)." },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return Response.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  return Response.json({ ok: true });
}
