"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {

  const [entries, setEntries] = useState<any[]>([]);
  const [mood, setMood] = useState("");
  const [sleep, setSleep] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const calculateNextPeriod = () => {

    if (!lastPeriodDate) return "No prediction yet";

    const date = new Date(lastPeriodDate);

    date.setDate(date.getDate() + cycleLength);

    return date.toDateString();
  };

  const calculateOvulation = () => {

    if (!lastPeriodDate) return "No prediction yet";

    const date = new Date(lastPeriodDate);

    date.setDate(date.getDate() + (cycleLength - 14));

    return date.toDateString();
  };

  const nextPeriodDate = new Date(calculateNextPeriod());

  const ovulationDate = new Date(calculateOvulation());

  useEffect(() => {

    const savedEntries = localStorage.getItem("wellnessEntries");

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    const savedPeriodDate =
      localStorage.getItem("lastPeriodDate");

    const savedCycleLength =
      localStorage.getItem("cycleLength");

    if (savedPeriodDate) {
      setLastPeriodDate(savedPeriodDate);
    }

    if (savedCycleLength) {
      setCycleLength(Number(savedCycleLength));
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "lastPeriodDate",
      lastPeriodDate
    );

    localStorage.setItem(
      "cycleLength",
      cycleLength.toString()
    );

  }, [lastPeriodDate, cycleLength]);

  const totalEntries = entries.length;

  const averageSleep =
    entries.length > 0
      ? (
          entries.reduce(
            (acc, entry) => acc + Number(entry.sleep),
            0
          ) / entries.length
        ).toFixed(1)
      : "0";

  const mostCommonMood =
    entries.length > 0
      ? entries.reduce((acc: any, entry: any) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;

          return acc;
        }, {})
      : {};

  const topMood =
    Object.keys(mostCommonMood).length > 0
      ? Object.keys(mostCommonMood).reduce((a, b) =>
        mostCommonMood[a] > mostCommonMood[b] ? a : b
      )
      : "No Data";

  let wellnessInsight = "";

  if (Number(averageSleep) < 6) {
    wellnessInsight =
      "Your average sleep is below healthy levels. Better sleep consistency may improve overall wellness.";
  }

  else if (Number(averageSleep) >= 6) {
    wellnessInsight =
      "Your average sleep levels look healthy and well-balanced. Consistent rest supports overall wellness.";
  }

  else if (topMood === "Stressed" || topMood === "Anxious") {
    wellnessInsight =
      "Stress-related moods appear frequently. Consider relaxation and recovery habits.";
  }

  else if (totalEntries >= 5) {
    wellnessInsight =
      "Great job tracking your wellness consistently. Long-term tracking improves health awareness.";
  }

  else {
    wellnessInsight =
      "Your wellness patterns currently look stable. Continue tracking daily for deeper insights.";
  }

  const chartData = entries.map((entry, index) => ({
    day: `Entry ${index + 1}`,
    sleep: Number(entry.sleep),
  }));

  const deleteEntry = (indexToDelete: number) => {

    const updatedEntries = entries.filter(
      (_, index) => index !== indexToDelete
    );

    setEntries(updatedEntries);

    localStorage.setItem(
      "wellnessEntries",
      JSON.stringify(updatedEntries)
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const newEntry = {
      mood,
      sleep,
      symptoms,
    };

    const updatedEntries = [...entries, newEntry];

    setEntries(updatedEntries);

    localStorage.setItem(
      "wellnessEntries",
      JSON.stringify(updatedEntries)
    );

    setMood("");
    setSleep("");
    setSymptoms("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-white to-pink-100">

      <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-pink-300 opacity-30 blur-3xl"></div>

      <div className="absolute right-10 top-52 h-72 w-72 rounded-full bg-purple-300 opacity-30 blur-3xl"></div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">

        <h1 className="text-2xl font-bold text-pink-600">
          Aiora
        </h1>

        <div className="flex gap-6 text-gray-700">

          <a href="#features">
            Features
          </a>

          <a href="#analytics">
            Analytics
          </a>

          <a href="#tracker">
            Tracker
          </a>

        </div>

      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 text-center">

        <p className="mb-4 rounded-full bg-pink-100 px-4 py-1 text-sm font-medium text-pink-700">
          Smart Cycle & Wellness Tracking
        </p>

        <h1 className="max-w-4xl text-6xl font-bold leading-tight text-gray-900">
          Aiora
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Personalized women’s health insights for smarter cycle,
          symptom, and wellness tracking.
        </p>

        <div className="mt-10 flex gap-4">

          <button
            onClick={() =>
              document
                .getElementById("tracker")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-2xl bg-pink-600 px-8 py-4 text-white shadow-lg transition hover:bg-pink-700"
          >
            Get Started
          </button>

          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-2xl border border-gray-300 bg-white px-8 py-4 text-gray-700 transition hover:bg-gray-100"
          >
            Learn More
          </button>

        </div>

      </section>

      <section
        id="features"
        className="mx-auto grid max-w-6xl gap-6 px-6 py-24 md:grid-cols-3"
      >

        <div className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">

          <h2 className="text-2xl font-semibold text-pink-600">
            Cycle Tracking
          </h2>

          <p className="mt-3 text-gray-600">
            Track cycles, symptoms, sleep, and mood patterns effortlessly.
          </p>

        </div>

        <div className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">

          <h2 className="text-2xl font-semibold text-pink-600">
            Wellness Insights
          </h2>

          <p className="mt-3 text-gray-600">
            Get personalized insights into recurring wellness patterns.
          </p>

        </div>

        <div className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">

          <h2 className="text-2xl font-semibold text-pink-600">
            Privacy First
          </h2>

          <p className="mt-3 text-gray-600">
            Built with privacy-first design to keep your health data secure.
          </p>

        </div>

      </section>

      <section
        id="analytics"
        className="relative z-10 px-6 pb-24"
      >

        <div className="mx-auto max-w-6xl rounded-[40px] border border-pink-100 bg-white/70 p-8 shadow-2xl backdrop-blur">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-pink-600">
                Dashboard Analytics
              </p>

              <h2 className="mt-2 text-4xl font-bold text-gray-900">
                Smart Wellness Insights
              </h2>
            </div>

            <button
              onClick={() =>
                document
                  .getElementById("analytics")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-2xl bg-pink-600 px-5 py-3 text-white"
            >
              View Analytics
            </button>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-pink-50 p-6">

              <p className="text-sm text-gray-500">
                Total Entries
              </p>

              <h3 className="mt-3 text-4xl font-bold text-pink-600">
                {totalEntries}
              </h3>

            </div>

            <div className="rounded-3xl bg-purple-50 p-6">

              <p className="text-sm text-gray-500">
                Average Sleep
              </p>

              <h3 className="mt-3 text-4xl font-bold text-purple-600">
                {averageSleep}h
              </h3>

            </div>

            <div className="rounded-3xl bg-blue-50 p-6">

              <p className="text-sm text-gray-500">
                Most Common Mood
              </p>

              <h3 className="mt-3 text-4xl font-bold text-blue-600">
                {topMood}
              </h3>

            </div>

          </div>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-pink-50 p-6">

            <p className="text-sm font-medium text-pink-600">
              Wellness Insight
            </p>

            <p className="mt-3 text-lg leading-8 text-gray-700">
              {wellnessInsight}
            </p>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-lg">

              <p className="text-sm font-medium text-pink-600">
                Next Predicted Period
              </p>

              <h3 className="mt-3 text-2xl font-bold text-gray-900">
                {calculateNextPeriod()}
              </h3>

            </div>

            <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-lg">

              <p className="text-sm font-medium text-pink-600">
                Estimated Ovulation
              </p>

              <h3 className="mt-3 text-2xl font-bold text-gray-900">
                {calculateOvulation()}
              </h3>

            </div>

          </div>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-white p-6 shadow-lg">

            <p className="text-sm font-medium text-pink-600">
              Current Cycle Information
            </p>

            <div className="mt-4 space-y-3">

              <p className="text-lg text-gray-700">
                <strong>Last Period Date:</strong>{" "}
                {lastPeriodDate || "Not added"}
              </p>

              <p className="text-lg text-gray-700">
                <strong>Cycle Length:</strong>{" "}
                {cycleLength} days
              </p>

            </div>

          </div>

          <div className="mt-6 flex justify-center">

  <Calendar
  className="rounded-3xl bg-pink-50 p-4 text-blue-600 shadow-md"
  className="text-blue-600"
    onChange={(value) => setSelectedDate(value as Date)}
    value={selectedDate}

    tileContent={({ date }) => {

      if (!lastPeriodDate) return null;

      const formatDate = (d: Date) =>
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

      const calendarDate = formatDate(date);

      const lastPeriod =
        formatDate(new Date(lastPeriodDate));

      const ovulation =
        formatDate(ovulationDate);

      const nextPeriod =
        formatDate(nextPeriodDate);

      const isLastPeriod =
        calendarDate === lastPeriod;

      const isOvulation =
        calendarDate === ovulation;

      const isNextPeriod =
        calendarDate === nextPeriod;

      return (
        <div className="mt-1 flex justify-center gap-1">

          {isLastPeriod && (
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          )}

          {isOvulation && (
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          )}

          {isNextPeriod && (
            <div className="h-2 w-2 rounded-full bg-pink-500"></div>
          )}

        </div>
      );
    }}
  />

</div>
              <div className="mt-6 flex flex-wrap gap-4">

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>

                  <p className="text-sm text-gray-700">
                    Last Period
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-purple-500"></div>

                  <p className="text-sm text-gray-700">
                    Ovulation
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-pink-600"></div>

                  <p className="text-sm text-gray-700">
                    Predicted Next Period
                  </p>
                </div>

              </div>

            </div>

          <div>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-white p-6 shadow-lg">

            <h3 className="text-2xl font-bold text-gray-900">
              Sleep Trend
            </h3>

            <p className="mt-2 text-gray-600">
              Visualize your sleep patterns across entries.
            </p>

            <div className="mt-8 h-80">

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={chartData}>

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="sleep"
                    stroke="#ec4899"
                    strokeWidth={4}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </section>

      <section
        id="tracker"
        className="px-6 pb-24"
      >

        <div className="mx-auto max-w-3xl rounded-[32px] border border-pink-100 bg-white p-8 shadow-xl">

          <h2 className="text-4xl font-bold text-gray-900">
            Daily Wellness Tracker
          </h2>

          <p className="mt-3 text-gray-600">
            Log your daily symptoms and wellness patterns.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Last Period Date
              </label>

              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Cycle Length
              </label>

              <input
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none focus:border-pink-500"
              />
            </div>

          </div>

          <form
            className="mt-10 space-y-6"
            onSubmit={handleSubmit}
          >

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Mood
              </label>

              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none focus:border-pink-500"
              >

                <option value="">Select Mood</option>
                <option>Happy</option>
                <option>Neutral</option>
                <option>Sad</option>
                <option>Stressed</option>
                <option>Anxious</option>

              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Sleep Hours
              </label>

              <input
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                type="number"
                placeholder="Enter sleep hours"
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Symptoms
              </label>

              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Cramps, headache, fatigue..."
                rows={4}
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none focus:border-pink-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-pink-600 py-4 text-white transition hover:bg-pink-700"
            >
              Save Entry
            </button>

          </form>

          <div className="mt-10 space-y-4">

            <h3 className="text-2xl font-bold text-gray-900">
              Saved Entries
            </h3>

            {entries.map((entry, index) => (
              <div
                key={index}
                className="rounded-2xl border border-pink-200 bg-pink-50 p-4 shadow"
              >

                <p className="text-blue-800">
                  <strong>Mood:</strong> {entry.mood}
                </p>

                <p className="text-blue-800">
                  <strong>Sleep:</strong> {entry.sleep} hours
                </p>

                <p className="text-blue-800">
                  <strong>Symptoms:</strong> {entry.symptoms}
                </p>

                <button
                  onClick={() => deleteEntry(index)}
                  className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}