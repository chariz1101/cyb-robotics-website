-- ============================================================
-- Cyb Robotics — Seed data: "Collision-Detecting Alarm" guide
-- Run AFTER 0006 (parts_list must exist).
-- ============================================================
--
-- The first of the beginner guides the members portal was built for
-- (tasklist Week 5, "Ultrasonic alarm"). It is seeded rather than typed
-- into the dashboard so every environment — a fresh local database, a
-- staging project, the live one — has one complete guide to render:
-- parts list, ordered steps, and a public showcase entry.
--
-- The sketch itself lives at supabase/seed/collision-alarm.ino. Code
-- files are rows in project_files pointing at Supabase Storage, and a
-- storage object only exists once it is uploaded, so the upload stays a
-- dashboard step: Admin -> Projects -> Steps -> Sample code & downloads.
--
-- Re-running is safe: the project is guarded by its title, and the steps
-- by their (project_id, step_number) unique constraint.

-- ------------------------------------------------------------
-- 0. Prerequisite check
-- ------------------------------------------------------------
-- supabase/setup.sql only bundles 0001-0003, so a database set up from
-- it has no parts_list column and the insert below fails on a bare
-- "column ... does not exist". Say which file to run instead.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'parts_list'
  ) then
    raise exception
      'projects.parts_list is missing: run supabase/migrations/0006_project_parts_list.sql before this file.';
  end if;
end $$;

-- ------------------------------------------------------------
-- 1. The project
-- ------------------------------------------------------------
insert into public.projects (
  title, description, category, difficulty_level,
  parts_list, is_public_showcase, is_members_guide
)
select
  'Collision-Detecting Alarm',
  'An ultrasonic sensor watches the space in front of the board and sounds '
    'a buzzer when anything comes within 20 cm. It is the smallest useful '
    'piece of a self-driving robot: the part that notices an obstacle before '
    'the wheels reach it. Build it on a breadboard in an afternoon, then bolt '
    'it to the front of a chassis.',
  'Arduino',
  'Beginner',
  '1x Arduino Uno (any 5 V board works)
1x HC-SR04 ultrasonic distance sensor
1x Active buzzer, 5 V
1x LED, any colour
1x 220 ohm resistor
1x Breadboard
7x Male-to-male jumper wires
1x USB cable for the board',
  true,
  true
where not exists (
  select 1 from public.projects where title = 'Collision-Detecting Alarm'
);

-- ------------------------------------------------------------
-- 2. The steps
-- ------------------------------------------------------------
insert into public.project_steps (project_id, step_number, title, instructions)
select p.id, v.step_number, v.title, v.instructions
from public.projects p
cross join (values
  (
    1,
    'Lay out the parts',
    'Put the Arduino, the breadboard, the HC-SR04, the buzzer, the LED and the '
      '220 ohm resistor in front of you and check them off against the parts list.

The HC-SR04 has four pins in a row: VCC, TRIG, ECHO, GND. Note which way round '
      'they are before you plug anything in — the labels are printed on the back '
      'of the board and are hidden once it is in the breadboard.'
  ),
  (
    2,
    'Wire the ultrasonic sensor',
    'With the USB cable unplugged, seat the HC-SR04 in the breadboard and run '
      'four jumper wires:

VCC  -> 5V
GND  -> GND
TRIG -> D9
ECHO -> D10

TRIG is the pin the board shouts from; ECHO is the pin it listens on. Swapping '
      'the two is the most common reason this project reads nothing at all.'
  ),
  (
    3,
    'Wire the buzzer and the LED',
    'Buzzer + (the longer leg, sometimes marked with a dot) -> D8, buzzer - -> GND.

LED long leg -> one end of the 220 ohm resistor, the other end of the resistor '
      '-> D7. LED short leg -> GND. The resistor is what keeps the LED from '
      'burning out, so do not leave it out.

Use an active buzzer. A passive one needs a tone signal and will stay silent '
      'on a plain HIGH.'
  ),
  (
    4,
    'Upload the sketch',
    'Open collision-alarm.ino from the downloads below in the Arduino IDE, plug '
      'in the board, then choose Tools -> Board -> Arduino Uno and Tools -> Port '
      '-> the port that appeared when you plugged it in. Press Upload.

The LED on the board blinks while the sketch transfers. "Done uploading" means '
      'it is running.'
  ),
  (
    5,
    'Watch the readings',
    'Open Tools -> Serial Monitor and set it to 9600 baud. A distance in '
      'centimetres prints about sixteen times a second.

Move your hand slowly towards the sensor. The number should fall smoothly, and '
      'the buzzer and LED should come on as it passes 20. Move away and both '
      'should stop.

"no echo" means the pulse never came back — the sensor is pointed at open air, '
      'at something further than 2 m, or at a soft surface like a jumper, which '
      'scatters the sound instead of reflecting it.'
  ),
  (
    6,
    'Set your own trigger distance',
    'Near the top of the sketch:

const int TRIGGER_CM = 20;

That is the only number you need to change. A robot that moves quickly needs a '
      'larger value, because it travels further before it can stop; a desk alarm '
      'can use a smaller one. Change it, upload again, and check against the '
      'serial readings.

Once it behaves, tape the sensor to the front of a chassis and point it forward. '
      'The buzzer is now a bumper you never have to touch.'
  )
) as v(step_number, title, instructions)
where p.title = 'Collision-Detecting Alarm'
on conflict (project_id, step_number) do nothing;
