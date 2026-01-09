from flask import Flask, jsonify, request
import psycopg2
import secrets
from functools import wraps
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta, timezone, date

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

@app.route("/api/revoke", methods=["POST"])
@require_token
def logout_all():
    token = request.args.get("token")
    user_id = request.args.get("user_id")

    conn = connect_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM sessies WHERE gebruiker_id = %s AND key != %s", (user_id, token))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "Token ongeldig gemaakt (uitgelogd)"})

@app.route("/api/users", methods=["GET"])
@require_token
def list_users():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            g.gebruiker_id,
            g.naam,
            g.email,
            count(s.key)
        FROM gebruiker as g
        LEFT JOIN sessies as s
        ON g.gebruiker_id = s.gebruiker_id
        GROUP BY g.gebruiker_id;
    """)
    
    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "gebruiker_id": r[0],
            "naam": r[1],
            "email": r[2],
            "sessies": r[3]
        } for r in data
    ])

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
@app.route("/api/devices", methods=["GET"])
@require_token
def apparaten():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT
            a.apparaat_id,
            a.naam,
            a.actief,
            a.status,
            a.huidig_verbruik,
            o.naam as woonkamer,
            a.beheerd
        FROM apparaat a
        JOIN kamers o ON a.kamer = o.kamer_id
    """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "apparaat_id": r[0],
            "naam": r[1],
            "actief": r[2],
            "status": r[3],
            "huidig_verbruik": r[4],
            "kamer": str(r[5]),
            "beheerd": r[6]
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
# APPARAAT TOGGLE + LOGGING
# ============================
@app.route("/api/device/toggle", methods=["POST", "OPTIONS"])
@app.route("/api/devices/toggle", methods=["POST", "OPTIONS"])  # alias used by client
@cross_origin()
@require_token
def toggle_device():
    data = request.json or {}
    apparaat_id = data.get("apparaat_id")
    gewenste_status = data.get("gewenste_status")

    if apparaat_id is None or gewenste_status is None:
        return jsonify({"error": "`apparaat_id` en `gewenste_status` zijn verplicht"}), 400

    conn = connect_db()
    cur = conn.cursor()

    # Haal huidig verbruik op (voor logging)
    cur.execute("SELECT huidig_verbruik FROM apparaat WHERE apparaat_id = %s", (apparaat_id,))
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return jsonify({"error": "Apparaat niet gevonden"}), 404

    huidig_verbruik = row[0] if row[0] is not None else 0.0

    # Update apparaat status/actief
    cur.execute(
        "UPDATE apparaat SET actief = %s WHERE apparaat_id = %s",
        (gewenste_status, apparaat_id),
    )

    # Insert into apparaat_geschiedenis (tijd, actie, verbruikt, apparaat_id)
    tijd = datetime.now(timezone.utc)
    cur.execute(
        "INSERT INTO apparaat_geschiedenis (tijd, actie, verbruikt, apparaat_id) VALUES (%s, %s, %s, %s)",
        (tijd, gewenste_status, huidig_verbruik, apparaat_id),
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "ok", "apparaat_id": apparaat_id, "gewenste_status": gewenste_status})

# ============================
# ENERGY INTERVALS ENDPOINT
# ============================
@app.route("/api/energy/intervals", methods=["GET", "OPTIONS"])
@require_token
def energy_intervals():
    try:
        interval_minutes = int(request.args.get("interval", 30))
    except ValueError:
        return jsonify({"error": "Invalid interval"}), 400

    end_time_str = request.args.get("end")
    start_time_str = request.args.get("start")

    now = datetime.now(timezone.utc)
    try:
        end_time = datetime.fromisoformat(end_time_str) if end_time_str else now
    except Exception:
        return jsonify({"error": "Invalid end time format"}), 400

    try:
        start_time = datetime.fromisoformat(start_time_str) if start_time_str else (end_time - timedelta(days=1))
    except Exception:
        return jsonify({"error": "Invalid start time format"}), 400

    # normalize naive datetimes or date values to timezone-aware datetimes (UTC)
    def ensure_dt(v):
        if isinstance(v, datetime):
            return v if v.tzinfo is not None else v.replace(tzinfo=timezone.utc)
        if isinstance(v, date):
            return datetime(v.year, v.month, v.day, tzinfo=timezone.utc)
        return v

    end_time = ensure_dt(end_time)
    start_time = ensure_dt(start_time)

    if start_time >= end_time:
        return jsonify({"error": "start must be before end"}), 400

    conn = connect_db()
    cur = conn.cursor()
    # optional apparaat filter
    apparaat_id = request.args.get("apparaat_id")
    if apparaat_id is not None:
        try:
            apparaat_id = int(apparaat_id)
        except ValueError:
            cur.close()
            conn.close()
            return jsonify({"error": "Invalid apparaat_id"}), 400

        cur.execute(
            "SELECT tijd, verbruikt FROM apparaat_geschiedenis WHERE tijd >= %s AND tijd <= %s AND apparaat_id = %s ORDER BY tijd ASC",
            (start_time, end_time, apparaat_id),
        )
        rows = cur.fetchall()

        # Get first entry before our current entry to extrapolate data (for same device)
        cur.execute(
            "SELECT tijd, verbruikt FROM apparaat_geschiedenis WHERE tijd < %s AND apparaat_id = %s ORDER BY tijd DESC LIMIT 1",
            (start_time, apparaat_id)
        )
        before = cur.fetchone()
    else:
        cur.execute(
            "SELECT tijd, verbruikt FROM apparaat_geschiedenis WHERE tijd >= %s AND tijd <= %s ORDER BY tijd ASC",
            (start_time, end_time),
        )
        rows = cur.fetchall()

        # Get first entry before our current entry to extrapolate data (any device)
        cur.execute(
            "SELECT tijd, verbruikt FROM apparaat_geschiedenis WHERE tijd < %s ORDER BY tijd DESC LIMIT 1",
            (start_time,)
        )
        before = cur.fetchone()

    points = []  # list of (dt, watt)

    if before:
        # use the last-known value before start at exactly start_time
        points.append((start_time, before[1]))

    for r in rows:
        t = ensure_dt(r[0])
        points.append((t, r[1]))

    # If still no points, return zeroed buckets
    if not points:
        cur.close()
        conn.close()

        # build buckets but with zero values
        buckets = []
        pointer = start_time
        delta = timedelta(minutes=interval_minutes)
        while pointer < end_time:
            b_end = min(end_time, pointer + delta)
            buckets.append({
                "start": str(pointer),
                "end": str(b_end),
                "energy_kwh": 0.0,
                "avg_kw": 0.0,
            })
            pointer = b_end

        return jsonify({"buckets": buckets})

    # Ensure there's a point at the very end with last known value
    last_value = points[-1][1]
    if points[-1][0] < end_time:
        points.append((end_time, last_value))

    # Build timeframes: pair consecutive points
    timeframes = []  # list of (start, end, watts)
    for i in range(len(points) - 1):
        s = points[i][0]
        e = points[i + 1][0]
        watts = points[i][1]
        # skip zero-length frames
        if e <= s:
            continue
        timeframes.append((s, e, watts))

    # Prepare buckets
    buckets = []
    bucket_duration = timedelta(minutes=interval_minutes)
    b_start = start_time
    while b_start < end_time:
        b_end = min(end_time, b_start + bucket_duration)
        buckets.append({"start": b_start, "end": b_end, "energy_kwh": 0.0})
        b_start = b_end

    # Aggregate: for each timeframe, split / add energy to intersecting buckets
    for tf_start, tf_end, watts in timeframes:
        for b in buckets:
            overlap_start = max(tf_start, b["start"])
            overlap_end = min(tf_end, b["end"])
            if overlap_end <= overlap_start:
                continue
            overlap_seconds = (overlap_end - overlap_start).total_seconds()
            hours = overlap_seconds / 3600.0
            energy_kwh = (watts * hours) / 1000.0
            b["energy_kwh"] += energy_kwh

    # Build response list with avg kW per bucket
    resp_buckets = []
    for b in buckets:
        duration_hours = (b["end"] - b["start"]).total_seconds() / 3600.0
        avg_kw = (b["energy_kwh"] / duration_hours) if duration_hours > 0 else 0.0
        resp_buckets.append({
            "start": b["start"].isoformat(),
            "end": b["end"].isoformat(),
            "energy_kwh": round(b["energy_kwh"], 6),
            "avg_kw": round(avg_kw, 6),
        })

    cur.close()
    conn.close()

    return jsonify({"buckets": resp_buckets})


# ============================
# START
# ============================
if __name__ == "__main__":
    app.run(debug=True)


# what we need to do:
# 1. fetch all update entries in the last 24 hours + the current time ofc
# 2. turn them into Timeframes (start, end, Watt_usage)
# 3. Find timeframes that intersect with our specified interval (30-60 minutes)
# 4. Create table 'kW usage per half hour', every instance that fully falls in a interval is added anyway
# 5. the remaining Intersections are linearly added to both ones it is in