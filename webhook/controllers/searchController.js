const axios = require('axios');
const becknAuthService = require('../services/becknAuthService');

const handleSearch = (context) => {
    const onSearchContext = {
        ...context, 
        action: 'on_search', 
        timestamp: new Date().toISOString() 
    };
    
    const onSearchPayload = {
        context: onSearchContext,
        "message": {
              "catalog": {
                  "descriptor": {
                      "name": "Catalog for Government Scheme Training"
                  },
                  "providers": [
                      {
                          "id": "HAQDARSHAK-PROVIDER-1",
                          "descriptor": {
                              "name": "Haqdarshak Skilling Initiatives",
                              "short_desc": "Training modules for navigating and applying for government schemes.",
                              "images": [
                                  {
                                      "url": "https://haqdarshak.com/wp-content/uploads/2021/08/Haqdarshak-Logo-1.png",
                                      "size_type": "sm"
                                  }
                              ]
                          },
                          "categories": [
                              {
                                  "id": "GOV-SCHEMES-HEALTH",
                                  "descriptor": {
                                      "code": "GOV-SCHEMES-HEALTH",
                                      "name": "Healthcare Schemes"
                                  }
                              },
                              {
                                  "id": "GOV-SCHEMES-FINANCE",
                                  "descriptor": {
                                      "code": "GOV-SCHEMES-FINANCE",
                                      "name": "Financial Inclusion Schemes"
                                  }
                              },
                              {
                                  "id": "GOV-SCHEMES-LIVELIHOOD",
                                  "descriptor": {
                                      "code": "GOV-SCHEMES-LIVELIHOOD",
                                      "name": "Livelihood and Employment Schemes"
                                  }
                              }
                          ],
                          "items": [
                              {
                                  "id": "COURSE-PMJAY-001",
                                  "quantity": {
                                      "maximum": {
                                          "count": 1
                                      }
                                  },
                                  "descriptor": {
                                      "name": "Pradhan Mantri Jan Arogya Yojana (PM-JAY) Training",
                                      "short_desc": "A comprehensive guide for agents to assist citizens in applying for PM-JAY.",
                                      "long_desc": "<p><strong>Course Overview:</strong><br>This module provides end-to-end training on the PM-JAY scheme. Agents will learn about eligibility criteria, the application process, required documentation, and how to handle common citizen queries.</p><ol><li><strong>Eligibility Checks:</strong><br>Learn how to verify a citizen's eligibility using official portals.</li><li><strong>Application Process:</strong><br>Step-by-step walkthrough of the online and offline application forms.</li><li><strong>Documentation:</strong><br>Understand all required documents like Aadhaar, Ration Card, and income certificates.</li></ol><p><strong>Why Take This Course:</strong></p><ul><li>Empower citizens to access critical healthcare benefits.</li><li>Become a certified Haqdarshak agent for health schemes.</li><li>Gain skills applicable across various government welfare programs.</li></ul>",
                                      "images": [
                                          {
                                              "url": "https://pmjay.gov.in/sites/default/files/inline-images/ab-pmjay-logo-english.png"
                                          }
                                      ],
                                      "media": [
                                          {
                                              "url": "https://haqdarshak.com/schemes/pm-jay-training-preview"
                                          }
                                      ]
                                  },
                                  "creator": {
                                      "descriptor": {
                                          "name": "Haqdarshak Training Team",
                                          "short_desc": "Expert trainers specializing in government welfare schemes and last-mile service delivery.",
                                          "long_desc": "The Haqdarshak Training Team comprises policy experts and field veterans dedicated to simplifying access to government services for every Indian citizen.",
                                          "images": [
                                              {
                                                  "url": "https://haqdarshak.com/wp-content/uploads/2021/08/Haqdarshak-Logo-1.png"
                                              }
                                          ]
                                      }
                                  },
                                  "price": {
                                      "currency": "INR",
                                      "value": "0"
                                  },
                                  "category_ids": [
                                      "GOV-SCHEMES-HEALTH",
                                      "GOV-SCHEMES-FINANCE"
                                  ],
                                  "rating": "4.8",
                                  "rateable": true,
                                  "tags": [
                                      {
                                          "descriptor": {
                                              "code": "scheme-metadata",
                                              "name": "Scheme Metadata"
                                          },
                                          "list": [
                                              {
                                                  "descriptor": {
                                                      "code": "learner-level",
                                                      "name": "Learner Level"
                                                  },
                                                  "value": "Beginner"
                                              },
                                              {
                                                  "descriptor": {
                                                      "code": "scheme-type",
                                                      "name": "Scheme Type"
                                                  },
                                                  "value": "Healthcare Insurance"
                                              },
                                              {
                                                  "descriptor": {
                                                      "code": "target-audience",
                                                      "name": "Target Audience"
                                                  },
                                                  "value": "Low-income families, SECC-eligible citizens"
                                              },
                                              {
                                                  "descriptor": {
                                                      "code": "lang-code",
                                                      "name": "Language"
                                                  },
                                                  "value": "hi, en, mr"
                                              },
                                              {
                                                  "descriptor": {
                                                      "code": "course-duration",
                                                      "name": "Course Duration"
                                                  },
                                                  "value": "P5H"
                                              }
                                          ],
                                          "display": true
                                      }
                                  ]
                              }
                          ],
                          "fulfillments": [
                              {
                                  "agent": {
                                      "person": {
                                          "name": "Haqdarshak Certified Agent"
                                      },
                                      "contact": {
                                          "email": "support@haqdarshak.com"
                                      }
                                  }
                              }
                          ]
                      }
                  ]
              }
          }
    };

    const authorizationHeader = becknAuthService.createAuthorizationHeader(onSearchPayload);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': authorizationHeader
    };

    const bapUri = context.bap_uri;
    axios.post(`${bapUri}/on_search`, onSearchPayload, { headers })
        .then(res => console.log(`Sent on_search to ${bapUri}/on_search`))
        .catch(err => console.error(`Error sending on_search:`, err.message));
};

module.exports = {
    handleSearch
};