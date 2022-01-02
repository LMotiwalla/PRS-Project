/* Import NPM dependencies */
const fs = require('fs');
const parse = require('csv-parse');
const _ = require('lodash');
const keyword_analyzer = require('keyword-analyzer');

/* Read & Parse doctor-names.csv */
fs.readFile('./doctor-names.csv', function (err, fileData) {
  parse(fileData, {columns: true, trim: true}, function(err, rows) {
    /* Map 2D names CSV data into 1D name array */
    const names = _.map(rows, row =>
      row["physician"].trim().toLowerCase().replace(/[a-z] [a-z] [a-z]/g, ' ').replace(/\s\s+/g, ' ')
    );

    /* Read & Parse comments.csv */
    fs.readFile('./comments.csv', function (err, fileData) {
      parse(fileData, {columns: true, trim: true}, function(err, rows) {
        /* Filter based on doctor name */
        const filtered_comments = _.filter(rows, row => 
            /* Case Insensitive Comparison to Names array */
            _.includes(names, row["physician"].trim().toLowerCase().replace(/ [a-z] /g, ' ').replace(/\s\s+/g, ' '))
        ).map(comment => ({
            physician: comment["physician"],
            text: comment["text"],
            patient_rating_scaled: Number(comment["patient_rating_scaled"]),
            sentiment_rating_unscaled: Number(comment["sentiment_rating_unscaled"]),
            sentiment_rating_scaled: Number(comment["sentiment_rating_scaled"]),
            sentiment_text: comment.sentiment_rating_scaled > 3 ? "Positive" : (comment.sentiment_rating_scaled > 2 ? "Neutral" : "Negative"),
            link: comment["link"].replace(/ /g, '.'),
            source: comment["link"].includes("healthgrades") ? "Healthgrades" : (comment["link"].includes("vitals") ? "Vitals" : "Other")
            /* NEW COMMENT METRICS GO HERE */
        }));

        /* Print metadata to console output */
        console.log(`Total: ${rows.length} comments`);
        console.log(`Working Set: ${names.length} doctors`);
        console.log(`Working Set: ${filtered_comments.length} comments`);

        fs.readFile('./physicians.csv', function (err, fileData) {
            parse(fileData, {columns: true, trim: true}, function(err, physicians) {
                const processed_data = physicians.map((physician, index) => ({
                    id: index,
                    name: physician["Name"],
                    degree: physician["Degree"],
                    specialty: physician["Specialty"],
                    gender: physician["Gender"],
                    age: Number(physician["Age"]),
                    total_reviews: (Number(physician["Review_No_HG"]) + Number(physician["Review_No_vital"])),
                    total_score: (Number(physician["New_total_score_HG1"]) * Number(physician["Review_No_HG"]) + Number(physician["Total_score_vital"]) * Number(physician["Review_No_vital"])) / (Number(physician["Review_No_HG"]) + Number(physician["Review_No_vital"])),
                    healthgrades_score: Number(physician["New_quality_score_HG"]),
                    vitals_score: Number(physician["New_quality_score_vital"]),
                    /* NEW PHYSICIAN METRICS GO HERE */
                })).map(physician => {
                    physician_comments = _.filter(filtered_comments, comment => (comment["physician"] == physician["name"]));

                    return Object.assign(physician, {
                        comments: physician_comments,
                        total_comments: physician_comments.length,
                        keywords: keyword_analyzer
                        .wrest(physician_comments.map(comment => comment.text).join(" "), {
                            stopWords: [
                                "dr", "", "doctor", "medical", "patient", "doctors", "physician", "office", "patients",
                                "tales", "health", "call", "told", "questions", "primary", "practice",
                                "lot", "months", "hours", "days", "pcp", "day", "minutes", "extremely", "people",
                                "husband", "wife", "mother", "father", "son", "daughter", "hour", "month", "hospital", "week",
                                "weels", "review", "reviews", "moved", "appt", "loved", "absolutely", "medicine", "family",
                                "takes", "total", "highly", "offer", "save", "easy", "staff"
                            ].concat(require('stopwords').english)
                        })
                        .filter(keyword => keyword.length > 3)
                        .filter(keyword => !physician["name"].toLowerCase().split(" ").includes(keyword))
                        .slice(0, 8)
                        /* NEW COMMENT CALCULATED FIELDS GO HERE */
                    })
                });
                
                fs.writeFileSync("data-synthesized.json", JSON.stringify(processed_data, null, 4));
            });
        });
      });
    });
  });
});
