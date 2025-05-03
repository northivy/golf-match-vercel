import { useState } from "react";

const holes = Array.from({ length: 18 }, (_, i) => i + 1);
const maidstoneStrokeIndex = {
  1: 3, 2: 9, 3: 1, 4: 5, 5: 13, 6: 11, 7: 7, 8: 15, 9: 17,
  10: 2, 11: 4, 12: 16, 13: 10, 14: 18, 15: 8, 16: 6, 17: 12, 18: 14
};
const danGetsStrokes = [3, 11, 1, 12, 4, 17];
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
      if (hole <= 6) {
        const netYou = you;
        const netDan = dan - danStroke;
        if (netYou !== netDan) {
          const winner = netYou < netDan ? "you" : "dan";
          setPoints((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
        }
      }

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

  const addSidePoint = (hole, player, type) => {
    setPoints((prev) => ({ ...prev, [player]: prev[player] + 1 }));
  };

  return (
    <div className="p-4 max-w-md mx-auto text-sm font-sans">
      <h2 className="text-lg font-bold mb-4 text-center">Golf Match Tracker</h2>
      <div className="flex flex-col gap-4">
        {holes.map((hole) => (
          <div key={hole} className="border p-3 rounded shadow">
            <div className="font-semibold mb-2">
              Hole {hole}{" "}
              {danGetsStrokes.includes(hole) && (
                <span className="text-green-600">– Dan gets a stroke</span>
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Your score"
                className="border rounded p-2 w-1/2"
                onChange={(e) => updateScore(hole, "you", e.target.value)}
              />
              <input
                type="number"
                placeholder="Dan's score"
                className="border rounded p-2 w-1/2"
                onChange={(e) => updateScore(hole, "dan", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
              {["closest", "longest", "greenie", "sandie", "snake"].map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    onChange={(e) => e.target.checked && addSidePoint(hole, "you", type)}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-base font-bold text-center">
        Total Points — You: {points.you} | Dan: {points.dan} | ${5 * Math.abs(points.you - points.dan)}
      </div>
    </div>
  );
}
