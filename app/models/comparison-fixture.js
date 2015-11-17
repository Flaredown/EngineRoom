/**
 *
 * @param segmented {boolean} return segmented groups
 * @returns {*[]}
 */
var fixture = function(segmented) {
    if (segmented) {
        return [
            {
                "top_conditions": [
                    {
                        "groupBy": {"sex": "male"},
                        "values": [
                            {"_id": "depression", "count": 108},
                            {"_id": "fibromyalgia", "count": 99},
                            {"_id": "anxiety", "count": 87},
                            {"_id": "migraine", "count": 81},
                            {"_id": "chronic fatigue syndrome", "count": 75},
                            {"_id": "ehlers-danlos syndrome", "count": 70},
                            {"_id": "irritable bowel syndrome", "count": 68},
                            {"_id": "crohn's disease", "count": 61},
                            {"_id": "asthma", "count": 58},
                            {"_id": "hashimoto's thyroiditis", "count": 55}
                        ]
                    },
                    {
                        "groupBy": {"sex": "female"},
                        "values": [
                            {"_id": "depression", "count": 158},
                            {"_id": "fibromyalgia", "count": 148},
                            {"_id": "migraine", "count": 140},
                            {"_id": "anxiety", "count": 135},
                            {"_id": "chronic fatigue syndrome", "count": 130},
                            {"_id": "ehlers-danlos syndrome", "count": 121},
                            {"_id": "crohn's disease", "count": 104},
                            {"_id": "irritable bowel syndrome", "count": 95},
                            {"_id": "hashimoto's thyroiditis", "count": 91},
                            {"_id": "hypothyroidism", "count": 88}
                        ]
                    }
                ]
            },
            {
                "n_conditions": [
                    {
                        "groupBy": {"sex": "male"},
                        "values": [
                            {"_id": 0,  "count": 56},
                            {"_id": 1,  "count": 101},
                            {"_id": 2,  "count": 154},
                            {"_id": 3,  "count": 132},
                            {"_id": 4,  "count": 89},
                            {"_id": 5,  "count": 65},
                            {"_id": 6,  "count": 45},
                            {"_id": 7,  "count": 30},
                            {"_id": 8,  "count": 21},
                            {"_id": 9,  "count": 15},
                            {"_id": 10, "count": 5},
                            {"_id": 11, "count": 3},
                            {"_id": 12, "count": 2},
                            {"_id": 14, "count": 1},
                            {"_id": 19, "count": 1}
                        ]
                    },
                    {
                        "groupBy": {"sex": "female"},
                        "values": [
                            {"_id": 0,  "count": 84},
                            {"_id": 1,  "count": 161},
                            {"_id": 2,  "count": 144},
                            {"_id": 3,  "count": 162},
                            {"_id": 4,  "count": 101},
                            {"_id": 5,  "count": 85},
                            {"_id": 6,  "count": 55},
                            {"_id": 7,  "count": 51},
                            {"_id": 8,  "count": 41},
                            {"_id": 9,  "count": 20},
                            {"_id": 10, "count": 14},
                            {"_id": 11, "count": 10},
                            {"_id": 12, "count": 6},
                            {"_id": 13, "count": 2},
                            {"_id": 14, "count": 1},
                            {"_id": 18, "count": 1},
                            {"_id": 21, "count": 1},
                            {"_id": 25, "count": 1}
                        ]
                    }
                ]
            },
            {
                "top_symptoms": [
                    {
                        "groupBy": {"sex": "male"},
                        "values": [
                            {"_id": "fatigue", "count": 178},
                            {"_id": "headache", "count": 102},
                            {"_id": "brain fog", "count": 81},
                            {"_id": "anxiety", "count": 78},
                            {"_id": "joint pain", "count": 71},
                            {"_id": "pain", "count": 65},
                            {"_id": "nausea", "count": 60},
                            {"_id": "diarrhea", "count": 58},
                            {"_id": "depression", "count": 51},
                            {"_id": "dizziness", "count": 50}
                        ]
                    },
                    {
                        "groupBy": {"sex": "female"},
                        "values": [
                            {"_id": "fatigue", "count": 178},
                            {"_id": "headache", "count": 102},
                            {"_id": "brain fog", "count": 81},
                            {"_id": "pain", "count": 78},
                            {"_id": "joint pain", "count": 71},
                            {"_id": "anxiety", "count": 65},
                            {"_id": "nausea", "count": 60},
                            {"_id": "diarrhea", "count": 58},
                            {"_id": "depression", "count": 51},
                            {"_id": "dizziness", "count": 50}
                        ]
                    }
                ]
            },
            {
                "n_symptoms": [
                    {
                        "groupBy": {"sex": "male"},
                        "values": [
                            {"_id": 0,  "count": 30},
                            {"_id": 1,  "count": 151},
                            {"_id": 2,  "count": 144},
                            {"_id": 3,  "count": 110},
                            {"_id": 4,  "count": 88},
                            {"_id": 5,  "count": 63},
                            {"_id": 6,  "count": 40},
                            {"_id": 7,  "count": 32},
                            {"_id": 8,  "count": 21},
                            {"_id": 9,  "count": 15},
                            {"_id": 10, "count": 5},
                            {"_id": 12, "count": 2},
                            {"_id": 14, "count": 1},
                            {"_id": 16, "count": 1},
                            {"_id": 25, "count": 1}
                        ]
                    },
                    {
                        "groupBy": {"sex": "female"},
                        "values": [
                            {"_id": 0,  "count": 44},
                            {"_id": 1,  "count": 131},
                            {"_id": 2,  "count": 184},
                            {"_id": 3,  "count": 202},
                            {"_id": 4,  "count": 141},
                            {"_id": 5,  "count": 89},
                            {"_id": 6,  "count": 54},
                            {"_id": 7,  "count": 52},
                            {"_id": 8,  "count": 41},
                            {"_id": 9,  "count": 20},
                            {"_id": 10, "count": 14},
                            {"_id": 11, "count": 10},
                            {"_id": 12, "count": 6},
                            {"_id": 13, "count": 2},
                            {"_id": 18, "count": 1},
                            {"_id": 21, "count": 1},
                            {"_id": 25, "count": 1},
                            {"_id": 27, "count": 1},
                            {"_id": 35, "count": 100}
                        ]
                    }
                ]
            },
            {
                "top_treatments": [
                    {
                        "groupBy": {"sex": "male"},
                        "values": [
                            {"_id": "exercise", "count": 75},
                            {"_id": "magnesium", "count": 69},
                            {"_id": "vitamin d", "count": 61},
                            {"_id": "ibuprofen", "count": 57},
                            {"_id": "gluten free", "count": 53},
                            {"_id": "yoga", "count": 53},
                            {"_id": "dairy free", "count": 51},
                            {"_id": "sleep", "count": 46},
                            {"_id": "fish oil", "count": 45},
                            {"_id": "gabapentin", "count": 41}
                        ]
                    },
                    {
                        "groupBy": {"sex": "female"},
                        "values": [
                            {"_id": "vitamin d", "count": 91},
                            {"_id": "exercise", "count": 88},
                            {"_id": "magnesium", "count": 85},
                            {"_id": "ibuprofen", "count": 81},
                            {"_id": "meditation", "count": 71},
                            {"_id": "gluten free", "count": 66},
                            {"_id": "dairy free", "count": 50},
                            {"_id": "yoga", "count": 48},
                            {"_id": "fish oil", "count": 45},
                            {"_id": "sleep", "count": 44}
                        ]
                    }
                ]
            },
            {
                "n_treatments": [
                    {
                        "groupBy": {"sex": "male"},
                        "values": [
                            {"_id": 0,  "count": 78},
                            {"_id": 1,  "count": 131},
                            {"_id": 2,  "count": 155},
                            {"_id": 3,  "count": 112},
                            {"_id": 4,  "count": 80},
                            {"_id": 5,  "count": 64},
                            {"_id": 6,  "count": 42},
                            {"_id": 7,  "count": 31},
                            {"_id": 8,  "count": 23},
                            {"_id": 9,  "count": 15},
                            {"_id": 10, "count": 3},
                            {"_id": 11, "count": 5},
                            {"_id": 12, "count": 2},
                            {"_id": 15, "count": 1},
                            {"_id": 19, "count": 1},
                            {"_id": 30, "count": 1}
                        ]
                    },
                    {
                        "groupBy": {"sex": "female"},
                        "values": [
                            {"_id": 0,  "count": 94},
                            {"_id": 1,  "count": 201},
                            {"_id": 2,  "count": 124},
                            {"_id": 3,  "count": 112},
                            {"_id": 4,  "count": 105},
                            {"_id": 5,  "count": 81},
                            {"_id": 6,  "count": 58},
                            {"_id": 7,  "count": 51},
                            {"_id": 8,  "count": 43},
                            {"_id": 9,  "count": 19},
                            {"_id": 10, "count": 14},
                            {"_id": 11, "count": 5},
                            {"_id": 12, "count": 3},
                            {"_id": 13, "count": 2},
                            {"_id": 14, "count": 1},
                            {"_id": 18, "count": 1},
                            {"_id": 21, "count": 1},
                            {"_id": 25, "count": 1},
                            {"_id": 47, "count": 1}
                        ]
                    }
                ]
            }
        ];
    }

    return {
        "n_symptoms": [
            {
                "_id": 1,
                "count": 207
            },
            {
                "_id": 2,
                "count": 159
            },
            {
                "_id": 3,
                "count": 53
            },
            {
                "_id": 4,
                "count": 22
            },
            {
                "_id": 5,
                "count": 20
            },
            {
                "_id": 6,
                "count": 14
            },
            {
                "_id": 7,
                "count": 8
            },
            {
                "_id": 8,
                "count": 9
            },
            {
                "_id": 9,
                "count": 4
            },
            {
                "_id": 10,
                "count": 3
            },
            {
                "_id": 11,
                "count": 4
            },
            {
                "_id": 12,
                "count": 1
            },
            {
                "_id": 13,
                "count": 1
            },
            {
                "_id": 14,
                "count": 1
            },
            {
                "_id": 15,
                "count": 2
            },
            {
                "_id": 16,
                "count": 1
            },
            {
                "_id": 17,
                "count": 2
            },
            {
                "_id": 18,
                "count": 2
            },
            {
                "_id": 27,
                "count": 1
            },
            {
                "_id": 51,
                "count": 1
            }
        ],
        "top_treatments": [
            {
                "_id": "Vitamin d",
                "count": 56
            },
            {
                "_id": "Exercise",
                "count": 48
            },
            {
                "_id": "Magnesium",
                "count": 41
            },
            {
                "_id": "Ibuprofen",
                "count": 41
            },
            {
                "_id": "gluten free",
                "count": 29
            },
            {
                "_id": "Meditation",
                "count": 29
            },
            {
                "_id": "Gabapentin",
                "count": 27
            },
            {
                "_id": "Fish oil",
                "count": 25
            },
            {
                "_id": "Yoga",
                "count": 24
            },
            {
                "_id": "dairy free",
                "count": 24
            }
        ],
        "n_conditions": [
            {
                "_id": 1,
                "count": 357
            },
            {
                "_id": 2,
                "count": 85
            },
            {
                "_id": 3,
                "count": 30
            },
            {
                "_id": 4,
                "count": 22
            },
            {
                "_id": 5,
                "count": 8
            },
            {
                "_id": 6,
                "count": 4
            },
            {
                "_id": 7,
                "count": 3
            },
            {
                "_id": 8,
                "count": 2
            },
            {
                "_id": 9,
                "count": 3
            },
            {
                "_id": 13,
                "count": 1
            }
        ],
        "top_conditions": [
            {
                "_id": "Depression",
                "count": 99
            },
            {
                "_id": "Fibromyalgia",
                "count": 86
            },
            {
                "_id": "Anxiety",
                "count": 81
            },
            {
                "_id": "Migraine",
                "count": 56
            },
            {
                "_id": "Chronic fatigue syndrome",
                "count": 48
            },
            {
                "_id": "Ehlers-Danlos syndrome",
                "count": 43
            },
            {
                "_id": "Irritable bowel syndrome",
                "count": 39
            },
            {
                "_id": "Crohn's disease",
                "count": 34
            },
            {
                "_id": "Asthma",
                "count": 33
            },
            {
                "_id": "Hashimoto's disease",
                "count": 31
            }
        ],
        "n_treatments": [
            {
                "_id": 0,
                "count": 1
            },
            {
                "_id": 1,
                "count": 252
            },
            {
                "_id": 2,
                "count": 77
            },
            {
                "_id": 3,
                "count": 42
            },
            {
                "_id": 4,
                "count": 18
            },
            {
                "_id": 5,
                "count": 18
            },
            {
                "_id": 6,
                "count": 15
            },
            {
                "_id": 7,
                "count": 7
            },
            {
                "_id": 8,
                "count": 8
            },
            {
                "_id": 9,
                "count": 7
            },
            {
                "_id": 10,
                "count": 7
            },
            {
                "_id": 11,
                "count": 5
            },
            {
                "_id": 12,
                "count": 3
            },
            {
                "_id": 13,
                "count": 1
            },
            {
                "_id": 14,
                "count": 4
            },
            {
                "_id": 15,
                "count": 3
            },
            {
                "_id": 16,
                "count": 1
            },
            {
                "_id": 17,
                "count": 1
            },
            {
                "_id": 18,
                "count": 2
            },
            {
                "_id": 19,
                "count": 1
            },
            {
                "_id": 21,
                "count": 1
            },
            {
                "_id": 22,
                "count": 2
            },
            {
                "_id": 23,
                "count": 2
            },
            {
                "_id": 24,
                "count": 1
            },
            {
                "_id": 25,
                "count": 2
            },
            {
                "_id": 26,
                "count": 1
            },
            {
                "_id": 27,
                "count": 1
            },
            {
                "_id": 28,
                "count": 2
            },
            {
                "_id": 29,
                "count": 1
            },
            {
                "_id": 30,
                "count": 3
            },
            {
                "_id": 32,
                "count": 1
            },
            {
                "_id": 34,
                "count": 2
            },
            {
                "_id": 36,
                "count": 2
            },
            {
                "_id": 38,
                "count": 1
            },
            {
                "_id": 41,
                "count": 2
            },
            {
                "_id": 44,
                "count": 3
            },
            {
                "_id": 45,
                "count": 1
            },
            {
                "_id": 57,
                "count": 1
            },
            {
                "_id": 60,
                "count": 1
            },
            {
                "_id": 62,
                "count": 1
            },
            {
                "_id": 63,
                "count": 1
            },
            {
                "_id": 64,
                "count": 1
            },
            {
                "_id": 68,
                "count": 1
            },
            {
                "_id": 69,
                "count": 1
            },
            {
                "_id": 87,
                "count": 1
            },
            {
                "_id": 88,
                "count": 1
            },
            {
                "_id": 94,
                "count": 1
            },
            {
                "_id": 100,
                "count": 1
            },
            {
                "_id": 111,
                "count": 1
            },
            {
                "_id": 112,
                "count": 1
            },
            {
                "_id": 125,
                "count": 1
            }
        ],
        "top_symptoms": [
            {
                "_id": "Fatigue",
                "count": 290
            },
            {
                "_id": "Headache",
                "count": 133
            },
            {
                "_id": "Brain fog",
                "count": 105
            },
            {
                "_id": "Anxiety",
                "count": 102
            },
            {
                "_id": "Joint pain",
                "count": 101
            },
            {
                "_id": "Pain",
                "count": 85
            },
            {
                "_id": "Nausea",
                "count": 85
            },
            {
                "_id": "Diarrhea",
                "count": 85
            },
            {
                "_id": "Depression",
                "count": 81
            },
            {
                "_id": "Dizziness",
                "count": 60
            }
        ],
        "n_users": 515
    };
};

export default fixture;
