const supertest = require("supertest");
const app = require("../app");
const { expect } = require("chai");
const apps = require("../books-data");

describe("GET /apps", () => {
  it("should return an array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys("App", "Genres", "Rating");
      });
  });

  it("should be 400 if genre is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ genre: "invalid" })
      .expect(400, "must enter valid genre");
  });

  it("should be 400 if sort is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "invalid" })
      .expect(400, "sort must be one of app or rating");
  });

  it("should filter by Genre", () => {
    let expected = apps.filter(app => app["Genres"].includes("Action"));

    return supertest(app)
      .get("/apps")
      .query({ genre: "Action" })
      .expect(200)
      .expect("Content-type", /json/)
      .then(res => {
        expect(res.body).to.deep.equal(expected);
      });
  });

  it("should sort by App", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "App" })
      .expect(200)
      .expect("Content-type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.App < appAtI.App) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it("should sort by Rating", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "Rating" })
      .expect(200)
      .expect("Content-type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.Rating < appAtI.Rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});
