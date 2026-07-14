import { useState } from "react";

// 重み：合計に対する割合。あいさつ・おわりは短め、タングラム・数字課題は長めに設定
const DEFAULT_PARTS = [
  { id: 1, name: "あいさつ", weight: 0.05, note: "今日の流れを確認し、見通しを持たせる" },
  { id: 2, name: "ミニゲーム", weight: 0.12, note: "身体・気持ちをほぐすウォームアップ" },
  { id: 3, name: "絵本", weight: 0.15, note: "落ち着いて座る・聞く練習、語彙のインプット" },
  { id: 4, name: "タングラム", weight: 0.23, note: "図形認知・空間把握・集中力を養う" },
  { id: 5, name: "数字課題", weight: 0.23, note: "数概念・計算の基礎を個別ペースで進める" },
  { id: 6, name: "ゲーム", weight: 0.17, note: "ルール理解・順番待ち・楽しみながらの実践" },
  { id: 7, name: "おわりのあいさつ", weight: 0.05, note: "今日の振り返りと次回への見通し" },
];

const TOTAL_MINUTES = 45;

// 活動名候補とそれに紐づく「ねらい」候補ライブラリ
// 未経験のスタッフでも、活動名を選べばねらいの候補が出るようにする
const ACTIVITY_LIBRARY = {
  "あいさつ": [
    "今日の流れを確認し、見通しを持たせる",
    "気持ちの切り替え・活動モードへの導入",
    "挨拶の言葉・マナーを習慣として身につける",
  ],
  "ミニゲーム": [
    "身体・気持ちをほぐすウォームアップ",
    "楽しい雰囲気で活動への意欲を高める",
    "ルールのある遊びで順番やり取りを練習する",
  ],
  "絵本": [
    "落ち着いて座る・聞く練習",
    "語彙のインプット、想像力を育む",
    "物語の流れを理解し、質問に答える力を養う",
  ],
  "タングラム": [
    "図形認知・空間把握力を養う",
    "集中力を持続させる練習",
    "試行錯誤しながら課題に取り組む力を育む",
  ],
  "数字課題": [
    "数概念・計算の基礎を個別ペースで進める",
    "数字への抵抗感を減らし、楽しく触れる",
    "生活に結びつく数の感覚（時計・お金等）を養う",
  ],
  "製作": [
    "指先の巧緻性・微細運動を養う",
    "完成に向けて見通しを持って取り組む力を育む",
    "自分で選ぶ・工夫する経験を積む",
  ],
  "ゲーム": [
    "ルール理解・順番待ち・楽しみながらの実践",
    "勝ち負けを受け止める経験を積む",
    "友達とのやり取り・協力を体験する",
  ],
  "運動遊び": [
    "粗大運動で身体をしっかり動かす",
    "バランス感覚・体幹を養う",
    "身体を動かして気持ちを発散する",
  ],
  "パズル": [
    "論理的思考・空間認知力を養う",
    "最後までやり遂げる集中力を育む",
    "達成感を積み重ねて自信につなげる",
  ],
  "おわりのあいさつ": [
    "今日の振り返りと次回への見通し",
    "できたことを言葉にして自己肯定感につなげる",
    "活動の区切りをつけ、気持ちを落ち着ける",
  ],
  "数": [
    "数概念・計算の基礎を個別ペースで進める",
    "数字への抵抗感を減らし、楽しく触れる",
    "生活に結びつく数の感覚（時計・お金等）を養う",
  ],
  "空間認知": [
    "位置関係・方向・距離感をとらえる力を養う",
    "図形や地図など空間情報を理解する練習",
    "身体を使って空間を把握する感覚を育てる",
  ],
  "マッチング": [
    "同じもの・対応するものを見分ける力を養う",
    "視覚的な注意力・観察力を育む",
    "分類・整理する思考の基礎を作る",
  ],
  "色": [
    "色の名前・違いを識別する力を養う",
    "色を通じた表現・選択の楽しさを経験する",
    "生活の中での色分け・整理に役立つ感覚を育む",
  ],
  "形": [
    "図形の名前・特徴を理解する",
    "形の違いを見分ける観察力を養う",
    "身の回りの物の形への気づきを促す",
  ],
  "カードゲーム": [
    "ルール理解・順番待ちを楽しく練習する",
    "勝敗を受け止める経験を積む",
    "友達とのやり取り・駆け引きを体験する",
  ],
  "すごろく": [
    "順番を待つ・ルールに従う練習",
    "数字（サイコロの目）と移動を結びつけて理解する",
    "勝ち負けを通じて感情調整の経験を積む",
  ],
  "sst": [
    "場面に応じた適切な行動・言葉を練習する",
    "相手の気持ちを想像する視点を養う",
    "実際の対人場面を想定したロールプレイで実践力を育む",
  ],
  "記憶": [
    "短期記憶・ワーキングメモリーを使う練習",
    "見る・聞く情報を保持し再現する力を養う",
    "繰り返しの中で記憶の定着を促す",
  ],
  "感覚、運動": [
    "感覚刺激（触覚・前庭覚等）を通じて心身を整える",
    "粗大運動・微細運動をバランスよく養う",
    "感覚遊びを通じてリラックス・発散を促す",
  ],
  "ボードゲーム": [
    "ルールを理解し最後まで参加する力を養う",
    "順番・待つこと・戦略を考える経験を積む",
    "対人でのやり取り・駆け引きを楽しく学ぶ",
  ],
};

const ACTIVITY_NAME_OPTIONS = Object.keys(ACTIVITY_LIBRARY);

// 「療育課題 逆引きリファレンス表」の課題カテゴリー番号（01〜18）との対応
// 数字を持たない項目は、個別の認知課題ではなくセッション進行上の構成要素（あいさつ等）
const TASK_CATEGORY_MAP = {
  "あいさつ": null,
  "ミニゲーム": "09",
  "絵本": "07",
  "タングラム": "05",
  "数字課題": "04",
  "製作": "12",
  "ゲーム": "08",
  "運動遊び": "09",
  "パズル": "05",
  "おわりのあいさつ": null,
  "数": "04",
  "空間認知": "16 , 10",
  "マッチング": "03",
  "色": "01",
  "形": "02",
  "カードゲーム": "08",
  "すごろく": "08",
  "sst": "07 , 08",
  "記憶": "13",
  "感覚、運動": "09",
  "ボードゲーム": "08",
};

function TaskBadge({ name }) {
  const taskNo = TASK_CATEGORY_MAP[name];
  if (!taskNo) return null;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700, color: "#4a7f6d",
      background: "#e8f0ec", border: "1px solid #cdd6d1", borderRadius: 8,
      padding: "1px 7px", marginLeft: 6, whiteSpace: "nowrap",
    }}>
      課題No.{taskNo}
    </span>
  );
}

export default function App() {
  const [parts, setParts] = useState(DEFAULT_PARTS);
  const [totalMin, setTotalMin] = useState(TOTAL_MINUTES);

  const updateName = (id, name) => {
    setParts((ps) => ps.map((p) => (p.id === id ? { ...p, name } : p)));
  };
  const updateNote = (id, note) => {
    setParts((ps) => ps.map((p) => (p.id === id ? { ...p, note } : p)));
  };
  const updateWeight = (id, weight) => {
    setParts((ps) => ps.map((p) => (p.id === id ? { ...p, weight: Math.max(0.01, weight) } : p)));
  };
  const resetTemplate = () => setParts(DEFAULT_PARTS);

  const weightSum = parts.reduce((s, p) => s + p.weight, 0);
  const partsWithMinutes = parts.map((p) => ({
    ...p,
    minutes: Math.round((p.weight / weightSum) * totalMin),
  }));
  // 端数調整：合計が totalMin になるよう最後のパートで補正
  const minutesSum = partsWithMinutes.reduce((s, p) => s + p.minutes, 0);
  if (partsWithMinutes.length > 0) {
    partsWithMinutes[partsWithMinutes.length - 1].minutes += totalMin - minutesSum;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f2f4f1", fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif", color: "#2e3a36", padding: "24px 12px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }} className="no-print">
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#4a7f6d", fontWeight: 700 }}>療育サポート</div>
          <h1 style={{ fontSize: 22, margin: "6px 0 4px", fontWeight: 800 }}>🧩 セッション構成（7パートテンプレ）</h1>
          <p style={{ fontSize: 13, color: "#68756f", margin: 0 }}>あいさつ〜おわりのあいさつまで、7つの流れで組み立てます</p>
        </div>

        <section className="no-print" style={{ background: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 1px 4px rgba(46,58,54,.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14 }}>合計時間</strong>
            <div>
              <input type="number" min={10} max={120} value={totalMin} onChange={(e) => setTotalMin(+e.target.value || TOTAL_MINUTES)}
                style={{ width: 70, padding: "6px 10px", border: "1px solid #cdd6d1", borderRadius: 8, fontSize: 14, textAlign: "center" }} />
              <span style={{ fontSize: 12, color: "#68756f", marginLeft: 6 }}>分</span>
            </div>
          </div>
          <button onClick={resetTemplate} style={{ marginTop: 10, fontSize: 11, background: "none", border: "none", color: "#68756f", cursor: "pointer", textDecoration: "underline" }}>
            テンプレートを初期状態に戻す
          </button>
        </section>

        <section className="no-print" style={{ background: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 1px 4px rgba(46,58,54,.08)" }}>
          <strong style={{ fontSize: 14 }}>パートを編集</strong>
          {parts.map((p, idx) => {
            const suggestions = ACTIVITY_LIBRARY[p.name] || [];
            return (
              <div key={p.id} style={{ marginTop: 12, paddingTop: 12, borderTop: idx > 0 ? "1px solid #f0f2f0" : "none" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#8a958f", width: 20 }}>{idx + 1}</span>
                  <input value={p.name} onChange={(e) => updateName(p.id, e.target.value)}
                    list="activity-name-options"
                    placeholder="活動名（候補から選ぶか自由入力）"
                    style={{ flex: 1, padding: "6px 10px", border: "1px solid #cdd6d1", borderRadius: 8, fontSize: 13, fontWeight: 700 }} />
                  <TaskBadge name={p.name} />
                  <input type="number" step={0.01} min={0.01} max={1} value={p.weight}
                    onChange={(e) => updateWeight(p.id, +e.target.value)}
                    style={{ width: 60, padding: "6px 8px", border: "1px solid #cdd6d1", borderRadius: 8, fontSize: 12, textAlign: "center" }} />
                  <span style={{ fontSize: 11, color: "#8a958f" }}>重み</span>
                </div>

                {suggestions.length > 0 && (
                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <span style={{ fontSize: 10, color: "#8a958f", marginRight: 2, lineHeight: "22px" }}>ねらい候補：</span>
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => updateNote(p.id, s)}
                        style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, cursor: "pointer",
                          border: p.note === s ? "2px solid #4a7f6d" : "1px solid #cdd6d1",
                          background: p.note === s ? "#e8f0ec" : "#fff", color: "#2e3a36" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <input value={p.note} onChange={(e) => updateNote(p.id, e.target.value)}
                  placeholder="ねらい・メモ（候補から選ぶか自由入力）"
                  style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: "6px 10px", border: "1px dashed #cdd6d1", borderRadius: 8, fontSize: 12 }} />
              </div>
            );
          })}
          <datalist id="activity-name-options">
            {ACTIVITY_NAME_OPTIONS.map((name) => <option key={name} value={name} />)}
          </datalist>
          <button onClick={() => window.print()} style={{ marginTop: 16, width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: "#e9b44c", color: "#2e3a36", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            🖨️ 印刷する
          </button>
        </section>

        <section style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(46,58,54,.08)" }}>
          <h2 style={{ fontSize: 16, textAlign: "center", margin: "0 0 16px" }}>セッション構成（{totalMin}分）</h2>
          {partsWithMinutes.map((p, idx) => (
            <div key={p.id} style={{ display: "flex", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: idx < partsWithMinutes.length - 1 ? "1px solid #f0f2f0" : "none" }}>
              <div style={{ width: 50, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#4a7f6d" }}>{p.minutes}</div>
                <div style={{ fontSize: 10, color: "#8a958f" }}>分</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{idx + 1}. {p.name}<TaskBadge name={p.name} /></div>
                {p.note && <div style={{ fontSize: 12, color: "#68756f", marginTop: 2 }}>{p.note}</div>}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "right", fontSize: 11, color: "#8a958f", marginTop: 8 }}>
            合計：{partsWithMinutes.reduce((s, p) => s + p.minutes, 0)}分
          </div>
          <div style={{ fontSize: 10, color: "#a3aca6", marginTop: 10, borderTop: "1px dashed #eceeec", paddingTop: 8 }}>
            ※「課題No.」は「療育課題 逆引きリファレンス表」の課題カテゴリー（01〜18）に対応しています。発達ステップや教材例はそちらをご参照ください。
          </div>
        </section>

        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
