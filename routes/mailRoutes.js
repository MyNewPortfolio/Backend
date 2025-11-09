const route=require("express").Router();
const {contact, notifyVisit}=require("../service/mailService");

route.post("/contact",contact);
route.post("/visit", notifyVisit);

module.exports=route;