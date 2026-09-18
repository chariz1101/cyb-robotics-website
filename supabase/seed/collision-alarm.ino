/*
 * Collision-Detecting Alarm — Cyb Robotics beginner guide
 *
 * An HC-SR04 ultrasonic sensor watches the space in front of the board.
 * When something comes closer than TRIGGER_CM the buzzer sounds and the
 * LED lights, and both stop once the way is clear again.
 *
 * Wiring (Arduino Uno):
 *   HC-SR04 VCC  -> 5V
 *   HC-SR04 GND  -> GND
 *   HC-SR04 TRIG -> D9
 *   HC-SR04 ECHO -> D10
 *   Buzzer +     -> D8       (- to GND)
 *   LED anode    -> D7 through a 220 ohm resistor (cathode to GND)
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 8;
const int LED_PIN = 7;

/* Alarm distance in centimetres. Raise it for a faster robot. */
const int TRIGGER_CM = 20;

/* Readings above this are treated as "nothing there". The HC-SR04 is
 * only trustworthy to about 4 m, and a missed echo reads as a very large
 * distance, which would otherwise look like a clear path. */
const long MAX_CM = 200;

/* How long to wait for the echo, in microseconds. Two-way travel to
 * MAX_CM at ~29 us per cm, plus headroom. Without a timeout pulseIn()
 * blocks for a full second every time an echo goes missing. */
const unsigned long ECHO_TIMEOUT_US = MAX_CM * 2UL * 29UL + 1000UL;

/* The datasheet asks for 60 ms between pings so the previous echo has
 * died away. Sampling faster makes the readings jump around. */
const unsigned long PING_INTERVAL_MS = 60;

unsigned long lastPing = 0;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  Serial.begin(9600);
  Serial.println("Collision-detecting alarm ready.");
}

void loop() {
  if (millis() - lastPing < PING_INTERVAL_MS) return;
  lastPing = millis();

  long distance = readDistanceCm();

  /* 0 means the echo never came back — out of range, or the surface
   * scattered the pulse away. Treat it as a clear path rather than
   * firing the alarm on a sensor that simply heard nothing. */
  bool tooClose = (distance > 0 && distance <= TRIGGER_CM);

  digitalWrite(BUZZER_PIN, tooClose ? HIGH : LOW);
  digitalWrite(LED_PIN, tooClose ? HIGH : LOW);

  if (distance > 0) {
    Serial.print(distance);
    Serial.println(" cm");
  } else {
    Serial.println("no echo");
  }
}

/*
 * One ultrasonic reading, in centimetres, or 0 if no echo came back.
 *
 * Sound covers about 1 cm every 29 us, and the pulse makes the trip
 * twice, so the round-trip time is divided by 58.
 */
long readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  if (duration == 0) return 0;

  long cm = duration / 58;
  return (cm > MAX_CM) ? 0 : cm;
}
