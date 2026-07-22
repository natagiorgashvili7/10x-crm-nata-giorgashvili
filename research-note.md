# Research Note

**Source:** [MDN — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

**Keywords used to find it:** "javascript fetch api tutorial", "fetch async await mdn"

**Summary (ქართულად):**
ეს გვერდი განმარტავს, თუ როგორ მუშაობს Fetch API ბრაუზერში ქსელური მოთხოვნების გასაგზავნად. აღწერილია, რომ `fetch()` აბრუნებს Promise-ს, რომელიც საბოლოოდ resolve ხდება Response ობიექტით, და საჭიროა ცალკე `.json()` გამოძახება რეალური მონაცემების მისაღებად. ასევე ახსნილია, რომ `fetch()` მხოლოდ ქსელური შეცდომისას (მაგ. კავშირის გაწყვეტა) აგდებს catch-ს — HTTP 404 ან 500 კოდები არ ითვლება შეცდომად ავტომატურად, ამიტომ საჭიროა `response.ok`-ის ხელით შემოწმება. ეს პირდაპირ დამეხმარა `loadClients()` და `handleAddClient()` ფუნქციების სწორად დაწერაში, სადაც try/catch-თან ერთად ცალკე ვამოწმებ `response.ok`-ს. გვერდზე ასევე არის მაგალითები POST მოთხოვნის გაგზავნაზე headers-ითა და body-ით, რაც პირდაპირ გამოვიყენე Add Client ფუნქციონალისთვის.