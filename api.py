from flask import Flask, jsonify, request
import psycopg2
import secrets
from functools import wraps
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# =========================
# DATABASE CONNECTIE
# =========================
def connect_db():
    return psycopg2.connect(
        host="20.91.246.225",
        database="SlimHuis",
        user="postgres",
        password="test",
        port=5432,
        sslmode="require"
    )


# ============================
# TOKEN CHECK (VERPLICHT)
# ============================
def require_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.args.get("token")

        if not token:
            return jsonify({"error": "Geen token meegegeven"}), 401

        conn = connect_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT gebruiker_id, expires_at FROM sessies WHERE key = %s", (token,)
        )
        session = cur.fetchone()

        if not session:
            cur.close()
            conn.close()
            return jsonify({"error": "Ongeldige token"}), 403

        gebruiker_id, expires_at = session
        if expires_at < datetime.now():
            cur.execute("DELETE FROM sessies WHERE key = %s", (token,))
            conn.commit()
            cur.close()
            conn.close()
            return jsonify({"error": "Token verlopen"}), 403

        cur.close()
        conn.close()
        return func(*args, **kwargs)
    return wrapper
# ============================
# LOGIN (GEEN TOKEN NODIG)
# ============================
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    naam = data.get("naam")
    wachtwoord = data.get("wachtwoord")

    print(naam, wachtwoord)

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT gebruiker_id FROM gebruiker WHERE naam = %s AND wachtwoord = %s",
        (naam, wachtwoord)
    )
    gebruiker = cur.fetchone()

    if not gebruiker:
        cur.close()
        conn.close()
        return jsonify({"error": "Naam of wachtwoord fout"}), 401

    gebruiker_id = gebruiker[0]
    token = secrets.token_hex(16)
    expiry = datetime.now() + timedelta(hours=1)  # 1 hour expiry

    cur.execute(
        "INSERT INTO sessies (key, gebruiker_id, expires_at) VALUES (%s, %s, %s)",
        (token, gebruiker_id, expiry)
    )
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"token": token})


# =========================================================
# ✅ GEBRUIKERS (GET)
# =========================================================
@app.route("/api/gebruikers", methods=["GET"])
@require_token
def gebruikers():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT gebruiker_id, naam, email, rol FROM gebruiker")
    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {"gebruiker_id": r[0], "naam": r[1], "email": r[2], "rol": r[3]}
        for r in data
    ])

@app.route("/api/logout", methods=["POST"])
@require_token
def logout():
    token = request.args.get("token")

    conn = connect_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM sessies WHERE key = %s", (token,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "Token ongeldig gemaakt (uitgelogd)"})

# ============================
# ✅ OMGEVING
# ============================
@app.route("/api/omgeving", methods=["GET"])
@require_token
def omgeving():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT omgeving_id, naam, adres, type,
               gebruiker_id,
               energieverbruikgeschiedenis,
               energiecreatiegeschiedenis,
               huidig_energieverbruik,
               huidige_energieopwekking
        FROM omgeving
    """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "omgeving_id": r[0],
            "naam": r[1],
            "adres": r[2],
            "type": r[3],
            "gebruiker_id": r[4],
            "energieverbruiksgeschiedenis": r[5],
            "energiecreatiegeschiedenis": r[6],
            "huidig_energieverbruik": r[7],
            "huidige_energieopwekking": r[8]
        } for r in data
    ])


# ============================
# ✅ APPARATEN (MET FILTER)
# ============================
@app.route("/api/apparaten", methods=["GET"])
@require_token
def apparaten():
    apparaat_id = request.args.get("id")

    conn = connect_db()
    cur = conn.cursor()

    if apparaat_id:
        cur.execute("""
            SELECT apparaat_id, naam, type, status,
                   huidig_verbruik, installatie, omgeving_id
            FROM apparaat
            WHERE apparaat_id = %s
        """, (apparaat_id,))
    else:
        cur.execute("""
            SELECT apparaat_id, naam, type, status,
                   huidig_verbruik, installatie, omgeving_id
            FROM apparaat
        """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "apparaat_id": r[0],
            "naam": r[1],
            "type": r[2],
            "status": r[3],
            "huidig_verbruik": r[4],
            "installatie": str(r[5]),
            "omgeving_id": r[6]
        } for r in data
    ])
# ============================
# ✅ SENSORDATA
# ============================
@app.route("/api/sensordata", methods=["GET"])
@require_token
def sensordata():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT data_id, apparaat_id, tijdstempel, waarde,
               type_meting, positie_x, positie_y, huidig_energieverbruik,
               kamer_id
        FROM sensordata
        ORDER BY tijdstempel DESC
        LIMIT 100
    """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "data_id": r[0],
            "apparaat_id": r[1],
            "tijdstempel": str(r[2]),
            "waarde": r[3],
            "type_meting": r[4],
            "positie_x": r[5],
            "positie_y": r[6],
            "huidig_energieverbruik": r[7],
            "kamer_id": r[8]
        } for r in data
    ])
# ============================
# ✅ KAMERS
# ============================
@app.route("/api/kamers", methods=["GET"])
@require_token
def kamers():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT kamer_id, naam, positie_x, positie_y,
               formaat_x, formaat_y, modelid
        FROM kamers
    """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "kamer_id": r[0],
            "naam": r[1],
            "positie_x": r[2],
            "positie_y": r[3],
            "formaat_x": r[4],
            "formaat_y": r[5],
            "modelid": r[6]
        } for r in data
    ])

# ============================
# ✅ MELDINGEN (GET + POST)
# ============================
@app.route("/api/meldingen", methods=["GET", "POST"])
@require_token
def meldingen():
    conn = connect_db()
    cur = conn.cursor()

    if request.method == "POST":
        data = request.json
        cur.execute("""
            INSERT INTO melding (apparaat_id, type, bericht, tijdstempel, status)
            VALUES (%s, %s, %s, NOW(), %s)
        """, (
            data["apparaat_id"],
            data["type"],
            data["bericht"],
            data["status"]
        ))
        conn.commit()

        cur.close()
        conn.close()
        return jsonify({"status": "✅ Melding toegevoegd"})

    cur.execute("""
        SELECT melding_id, apparaat_id, type, bericht, tijdstempel, status
        FROM melding
        ORDER BY tijdstempel DESC
    """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "melding_id": r[0],
            "apparaat_id": r[1],
            "type": r[2],
            "bericht": r[3],
            "tijdstempel": str(r[4]),
            "status": r[5]
        } for r in data
    ])
# =========================================================
# ✅ REGRESSIE (AI UITKOMST)
# =========================================================
@app.route("/api/regressie", methods=["GET"])
@require_token
def regressie():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT waarde FROM sensordata
        WHERE type_meting = 'verbruik'
        ORDER BY tijdstempel DESC LIMIT 1
    """)
    data = cur.fetchone()
    cur.close()
    conn.close()

    return jsonify({
        "laatste_verbruik": data[0] if data else "Geen data"
    })

# ============================
# START
# ============================
if __name__ == "__main__":
    app.run(debug=True)