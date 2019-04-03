#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const request = require('request');
const cheerio = require('cheerio');

const log = console.log;

let array = [];

function checkAnswer() {
  getMetatags();
}

function getMetatags() {

  inquirer
    .prompt([{
      type: 'input',
      name: 'url',
      message: 'Input website url:'
    }])
    .then(answer => {

      let answerUrl = answer.url;
      let domainName;

      // get domain name
      if(answerUrl.includes('www.')) {
        domainName = answerUrl.split('www.');
        domainName = domainName[1].split('/')[0];
      } else if(answerUrl.includes('https://')) {
        domainName = answerUrl.split('https://');
        domainName = domainName[1].split('/')[0];
      } else if(answerUrl.includes('http://')) {
        domainName = answerUrl.split('http://');
        domainName = domainName[1].split('/')[0];
      } else {
        domainName = answerUrl.split('/')[0]
      }

      if(answerUrl === 'exit') {
        process.exit()
      } else if(!answerUrl.includes('http')) {
        answer = 'http://' + answerUrl
      }

      // make request
      request(answer, function(err, resp, html) {
      
        if(err) {
          log(chalk.bgRed('Please type valid URL address!'))
          checkAnswer();
          return;
        }
      
        const $ = cheerio.load(html);
      
        // get all anchors from request
        let links = $('a');
        $(links).each(function(i, link){
          let href = $(link).attr('href');
          // return if link is undefined or not includes domain name
          if(href === undefined || !href.includes(domainName)) {
            return
          }
          
          // push all anchor links into array
          array.push(href);
        });

        // get only unique values
        const uniqueValues = [...new Set(array)];

        let valLength = uniqueValues.length;

        // foreach all links
        uniqueValues.forEach(function(val, i) {

          // make reuest of all links
          request(val, function(err, resp, html) {
            
            // log meta tags if not error
            if(!err && resp.statusCode == 200) {
               
              // URL
              log('\n' + chalk.bgWhite.blue.bold('URL: ' + val) + '\n');
              
              const $sub = cheerio.load(html);
              
              // META TITLE
              log(chalk.magenta.bold('title => ') + chalk.green($sub("title").text()) + ' (' + $sub("title").text().length + ')');
              // META DESCRIPTION
              logResult($sub, 'name', 'description', 'magenta', true);
      
              log('-------------------------------------------------------');
      
              // OPEN GRAPH DATA
              logResult($sub, 'property', 'og:title', 'blue', true);
              logResult($sub, 'property', 'og:description', 'blue', true);
              logResult($sub, 'property', 'og:site_name', 'blue');
              logResult($sub, 'property', 'og:url', 'blue');
              logResult($sub, 'property', 'og:image', 'blue');
              logResult($sub, 'property', 'og:type', 'blue');
              logResult($sub, 'property', 'og:locale', 'blue');
      
              log('-------------------------------------------------------');
      
              // TWITTER CARDS
              logResult($sub, 'name', 'twitter:title', 'cyan', true);
              logResult($sub, 'name', 'twitter:description', 'cyan', true);
              logResult($sub, 'name', 'twitter:site', 'cyan');
              logResult($sub, 'name', 'twitter:creator', 'cyan');
              logResult($sub, 'name', 'twitter:card', 'cyan');
              logResult($sub, 'name', 'twitter:image', 'cyan');

            }
            
          });

        });

      });

  });
}

// function init
getMetatags();

// function for log meta tags into terminnal
function logResult(req, name, value, color, length) {
  log(typeof req("meta[" + name + "='" + value + "']").attr("content") !== 'undefined'
  ? chalk[color].bold(value + ' => ') + chalk.green(req("meta[" + name + "='" + value + "']").attr("content")) + (length === true ? ' (' + (req("meta[" + name + "='" + value + "']").attr("content")).length  + ')' : '')
  : chalk[color].bold(value + ' => ') + chalk.red('none'))
}