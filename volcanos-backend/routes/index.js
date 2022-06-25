var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = "Secret Key";

/* GET home page. */

// data section
// countries endpoint
router.get("/countries", function (req, res, next) {
  //if a query does not exist
  if (Object.keys(req.query).length === 0) {
    req.db.from('data').select("country")
      .then((rows) => {
        newRows = rows.map((row) => Object.values(row).toString())
        let rowsUnique = [...new Set(newRows)];
        let sortArray = rowsUnique.slice().sort((a, b) => a.localeCompare(b))
        res.json(sortArray)
      })
  }
  //if a query exists
  else if (req.query) {
    res.status(400).json({
      "error": true,
      "message": "Invalid query parameters. Query parameters are not permitted."
    })
  }
});

// volcanoes end point
router.get('/volcanoes', function (req, res, next) {
  var number_qeury = 0;
  for (var key in req.query) {
    if (req.query[key]) number_qeury++;
  }
  if (req.query.populatedWithin) {
    req.db.from('data').select("id", "name", "country", "region", "subregion").where('country', '=', req.query.country).andWhere(`population_${req.query.populatedWithin}`, '>', '0')
      .then((rows) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        res.status(400).json(
          {
            "error": true,
            "message": "Country is a required query parameter."
          }
        )
      })
  }
  else if (!req.query.populatedWithin && number_qeury >= 2) {

    res.status(400).json(
      {
        "error": true,
        "message": "Country is a required query parameter."
      }
    )
  }
  else {
    req.db.from('data').select("id", "name", "country", "region", "subregion").where('country', '=', req.query.country)
      .then((rows) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        res.status(400).json(
          {
            "error": true,
            "message": "Country is a required query parameter."
          }
        )
      })
  }

}
);
//authrozie middle ware function
const authorize = function (req, res, next) {
  const auth = req.headers.authorization
  let check = null;
  //retrieve token 
  if (!auth || auth.split(" ").length !== 2) {
    if (!auth) {
      return next()
    }
    else if (auth.split(" ").length !== 2) {
      return res.status(401).json({
        "error": true,
        "message": "Authorization header is malformed"
      })
    }
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, secretKey);
    if (Date.now() > payload.exp) {
      return res.status(401).json({
        "error": true,
        "message": "Expired JWT token"
      })
    }
    req.check = "logined"
    next();
  } catch (e) {
    return res.status(401).json({
      "error": true,
      "message": "Invalid JWT token"
    })
  }
}

router.get('/volcano/:id', authorize, function (req, res, next) {
  const id = req.params.id;
  // check id 
  if (id > 1343) {
    res.status(404).json(
      {
        "error": true,
        "message": "Volcano with ID: " + id + " not found."
      }
    )
    return;
  }
  // check the whether id is string
  if (!Number(id)) {
    res.status(400).json(
      {
        "error": true,
        "message": "Invalid query parameters. Query parameters are not permitted."
      }
    )
    return;
  }
  if (req.check == null) {
    req.db.from('data').select("id", "name", "country", "region", "subregion", "last_eruption", "summit", "elevation", "latitude", "longitude").where('id', '=', id)
      .then((rows) => {
        res.json(rows[0])
      })
  }
  else if (req.check == "logined") {
    req.db.from('data').select("id", "name", "country", "region", "subregion", "last_eruption", "summit", "elevation", "latitude", "longitude", "population_5km", "population_10km", "population_30km", "population_100km").where('id', '=', id)
      .then((rows) => {
        res.json(rows[0])
      })
  }
});

///authentication

//register section

router.post('/user/register', function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
    return;
  }

  req.db.from("user").select("*").where({ email })
    .then(user => {
      if (user.length > 0) {
        res.status(409).json({
          "error": true,
          "message": "User already exists"
        });
        return;
      }

      const hash = bcrypt.hashSync(password, 10);//  keep changing the password
      req.db.from("user").insert({ email, hash })
        .then(() => {
          res.status(201).json({
            "message": "User created"
          })
        });
    });
})

//login
router.post('/user/login', function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
    return;
  }

  req.db.from("user").select("*").where({ email })
    .then(user => {
      if (user.length === 0) {
        res.status(401).json({
          "error": true,
          "message": "Incorrect email or password"
        });
        return;
      }
      const { hash } = user[0];

      if (!bcrypt.compareSync(password, hash)) {
        res.status(401).json({
          "error": true,
          "message": "Incorrect email or password"
        })
        return;
      }
      const expires_in = 60 * 60 * 24;

      const exp = Date.now() + expires_in * 1000;
      const token = jwt.sign({ email, exp }, secretKey)// create

      res.status(200).json({
        token,
        token_type: "Bearer",
        expires_in
      })
    });
})


// profile

// get profile
const authorize_get_profile = function (req, res, next) {
  const auth = req.headers.authorization
  let check = null;
  //retrieve token 
  if (!auth || auth.split(" ").length !== 2) {
    if (!auth) {
      return next()
    }
    else if (auth.split(" ").length !== 2) {
      return res.status(401).json({
        "error": true,
        "message": "Authorization header is malformed"
      })
    }
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, secretKey);
    req.email_check = token
    if (Date.now() > payload.exp) {
      return res.status(401).json({
        "error": true,
        "message": "Expired JWT token"
      })
    }
    req.check = "logined"
    next();
  } catch (e) {
    return next()
  }
}

router.get('/user/:email/profile', authorize_get_profile, function (req, res, next) {
  const email = req.params.email;
  const payload_check = jwt.decode(req.email_check)
  req.db.from("user").select("*").where({ email })
    .then(user => {
      if (user.length === 0) {
        return res.status(404).json({
          "error": true,
          "message": "User not found"
        });
      }
      if (req.check == null || payload_check.email != email) {
        req.db.from('user').select("email", "firstName", "lastName").where('email', '=', email)
          .then((rows) => {
            res.json(rows[0])
          })
      }
      else if (req.check == "logined") {
        req.db.from('user').select("email", "firstName", "lastName", "dob" , "address").where('email', '=', email)
          .then((rows) => {
            let str_dob = JSON.stringify(Object.values(rows[0])[3])
            if (str_dob != "null"){
              new_dob = str_dob.split("T")[0].slice(1)
            }
            else{
              new_dob = null
            }
            res.json({
              "email": rows[0].email,
              "firstName": rows[0].firstName,
              "lastName": rows[0].lastName,
              "dob": new_dob,
              "address": rows[0].address
            })
          })
      }
    })
});

const authorize_update_profile = function (req, res, next) {
  const auth = req.headers.authorization
  let check = null;
  //retrieve token 
  if (!auth || auth.split(" ").length !== 2) {
    if (!auth) {
      return res.status(401).json({
        "error": true,
        "message": "Authorization header ('Bearer token') not found"
      })
    }
    else if (auth.split(" ").length !== 2) {
      return res.status(401).json({
        "error": true,
        "message": "Authorization header is malformed"
      })
    }
  }
  const token = auth.split(" ")[1];
  req.email_check = token
  try {
    const payload = jwt.verify(token, secretKey);
    if (Date.now() > payload.exp) {
      return res.status(401).json({
        "error": true,
        "message": "Expired JWT token"
      })
    }
    req.check = "logined"

    next();
  } catch (e) {
    return res.status(401).json({
      "error": true,
      "message": "Invalid JWT token"
    })
  }
}

// put profile 
router.put('/user/:email/profile', authorize_update_profile, function (req, res, next) {
  const email = req.params.email;
  const { firstName, lastName, dob, address } = req.body;
  const payload_check = jwt.decode(req.email_check)
  var ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
  var yyyymmdd = /^\d{4}-\d{2}-\d{2}$/
  var date = req.body.dob
  var number_body = 0;
  for (var key in req.body) {
    if (req.body[key]) number_body++;
  }
  if (number_body == 4){
    if (date.indexOf('T') != -1) {
      var new_date = date.split("T")[0]
    }
    else {
      new_date = date
    }
  }

  if (payload_check.email != email) {
    res.status(403).json({
      "error": true,
      "message": "Forbidden"
    })
  }

  else if (firstName && lastName && dob && address) {
    req.db.from('user').where('email', '=', req.params.email).update({
      firstName: req.body.firstName, lastName: req.body.lastName, dob: new_date, address: req.body.address
    })
      .then((rows) => {
        if(typeof req.body.firstName == "string" &&typeof req.body.lastName == "string" &&typeof req.body.address =="string" && new_date<=new Date().toISOString()){
          res.status(200).json({
            "email": email,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "dob": req.body.dob,
            "address": req.body.address
          })
        }else if(new_date > new Date().toISOString()){
          return res.status(400).json({
            "error": true,
            "message": "Invalid input: dob must be a date in the past."
          })
        }else if(!ISO_8601_FULL.test(req.body.dob)||!yyyymmdd.test(req.body.dob)){
          return res.status(400).json({
            "error": true,
            "message": "Invalid input: dob must be a real date in format YYYY-MM-DD."
          })
        }
        else{
          return res.status(400).json({
            "error": true,
            "message": "Request body invalid: firstName, lastName and address must be strings only."
          })
        }
      })
      .catch((err) => {
        if(new_date.split('-')[1]<0||new_date.split('-')[1]>13&&new_date.split('-')[2]<0||new_date.split('-')[2]>30){
          return res.status(400).json({
            "error": true,
            "message": "Invalid input: dob must be a real date in format YYYY-MM-DD."
          })
        }
        return res.status(400).json({
          "error": true,
          "message": "Request body incomplete: firstName, lastName, dob and address are required."
        })
      })
  }
  else {
    res.status(400).json({
      "error": true,
      "message": "Request body incomplete: firstName, lastName, dob and address are required."
    })
  }

})

//administration
router.get('/me', function (req, res, next) {
  res.status(200).json(
    {
      "name": "Yeonsu Lee",
      "student_number": "n11155418"
    }
  )
})



module.exports = router;
