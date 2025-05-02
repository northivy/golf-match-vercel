import { useState } from "react";

const holes = Array.from({ length: 18 }, (_, i) => i + 1);
const maidstoneStrokeIndex = {
  1: 3, 2: 9, 3: 1, 4: 5, 5: 13, 6: 11, 7: 7, 8: 15, 9: 17,
  10: 2, 11: 4, 12: 16, 13: 10, 14: 18, 15: 8, 16: 6, 17: 12, 18: 14
};
const danGetsStrokes = [3, 11, 1, 12, 4, 17]; // HCP values for Dan’s 6 strokes
const pointValues = { 13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6 };

export default function App() {
  const [scores, setScores] = useState({});
  const [points, setPoints] = useState({ you: 0, dan: 0 });

  const updateScore = (hole, player, value) => {
    const updated = {
      ...scores,
      [hole]: {
        ...(scores[hole] || {}),
        [player]: Number(value),
      },
    };
    setScores(updated);

    const you = updated[hole]?.you;
    const dan = updated[hole]?.dan;
    const danStroke = danGetsStrokes.includes(hole) ? 1 : 0;

    if (you != null && dan != null) {
      // Holes 1–6: Match Play
      if (hole <= 6) {
        const netYou = you;
        const netDan = dan - danStroke;
        if (netYou !== netDan) {
          const winner = netYou < netDan ? "you" : "dan";
          setPoints((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
        }
      }

      // Holes 7–12: Vegas
      if (hole >= 7 && hole <= 12) {
        const yourVegas = Number(`${you}${dan}`);
        const danVegas = Number(`${dan}${you}`);
        const diff = Math.abs(yourVegas - danVegas);
        if (yourVegas < danVegas) {
          setPoints((prev) => ({ ...prev, you: prev.you + diff }));
        } else if (danVegas < yourVegas) {
          setPoints((prev) => ({ ...prev, dan: prev.dan + diff }));
        }
      }

      // Holes 13–18: Point Game
      if (hole >= 13) {
        const pts = pointValues[hole] || 0;
        const netYou = you;
        const netDan = dan - danStroke;
        if (netYou !== netDan) {
          const winner = netYou < netDan ? "you" : "dan";
          setPoints((prev) => ({ ...prev, [winner]: prev[winner] + pts }));
        }
      }
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Golf Match Tracker</h2>
      <div className="grid grid-cols-1 gap-2">
        {holes.map((hole) => (
          <div key={hole} className="border p-3 rounded shadow-sm">
            <div className="font-semibold">
              Hole {hole}{" "}
              {danGetsStrokes.includes(hole) && (
                <span className="text-sm text-green-600">– Dan gets a stroke</span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                placeholder="Your score"
                className="border p-2 w-full"
                onChange={(e) => updateScore(hole, "you", e.target.value)}
              />
              <input
                type="number"
                placeholder="Dan's score"
                className="border p-2 w-full"
                onChange={(e) => updateScore(hole, "dan", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-lg font-bold text-center">
        Total Points — You: {points.you} | Dan: {points.dan} | $
        {5 * Math.abs(points.you - points.dan)}
      </div>
    </div>
  );
}
