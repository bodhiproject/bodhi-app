module.exports = {
  "extends": "airbnb",
  "env": {
    "node": true,
    "mocha": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "class-methods-use-this": [0
    ],
    "consistent-return": 0,
    "max-len": [2,
      {
        "code": 120
      }
    ],
    "no-console": 0,
    "no-param-reassign": [2,
      {
        "props": false
      }
    ],
    "no-plusplus": [0
    ],
    "no-underscore-dangle": [2,
      {
        "enforceInMethodNames": true
      }
    ],
    "no-use-before-define": [2,
      {
        "functions": false,
        "classes": false
      }
    ],
    "no-unused-vars": [1,
      {
        "args": "all",
        "caughtErrors": "none"
      }
    ],
    "object-property-newline": [2,
      {
        "allowAllPropertiesOnSameLine": true
      }
    ],
    "prefer-destructuring": [0
    ]
  }
};
