# 500円note制作AIチーム

500円の有料noteを「調査 → 執筆 → 告知」の順で制作・販売準備するAIチームです。

| 役割 | ファイル | 成果物 |
|---|---|---|
| 統括責任者 | [agents/00_orchestrator.md](agents/00_orchestrator.md) | 進行管理・引き継ぎ・最終確認 |
| 社員① 市場調査担当 | [agents/01_market_researcher.md](agents/01_market_researcher.md) | `deliverables/01_research_report.md` |
| 社員② 記事制作担当 | [agents/02_writer.md](agents/02_writer.md) | `deliverables/02_note_article.md` |
| 社員③ マーケティング担当 | [agents/03_marketer.md](agents/03_marketer.md) | `deliverables/03_threads_posts.md` |

## 進め方

1. オーナーが [intake.md](intake.md) の質問に回答する
2. 統括が回答を `deliverables/00_brief.md` にまとめ、社員①へ渡す
3. 社員① → 社員② → 社員③ の順に作業。各工程の終わりに統括が品質チェックし、合格したものだけ次へ引き継ぐ
4. 統括が最終パッケージ（記事＋Threads投稿30本＋公開チェックリスト）をオーナーに納品する

```
オーナー回答 ─▶ 統括(ブリーフ) ─▶ ①調査 ─▶ 統括チェック ─▶ ②執筆 ─▶ 統括チェック ─▶ ③告知 ─▶ 統括チェック ─▶ 納品
                                     ▲差し戻し           ▲差し戻し           ▲差し戻し
```
