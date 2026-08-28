**What changed**

**Source**

**Effect on the index** (paste the before/after build line for any country that
moves more than one rank)

**Checklist**
- [ ] `python indexes/teenager-outcomes/validate.py` exits 0
- [ ] `python indexes/teenager-outcomes/build.py` runs clean and `site/indexes/teenager-outcomes/toi.json` is committed
- [ ] `source` column is specific enough to locate the number
- [ ] `value_low <= value <= value_high`
