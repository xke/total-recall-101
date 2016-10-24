/*

Total Recall 101
by @xianke for http://productsafetyapps.challengepost.com/
updated 12/28/2015 to support latest CPSC API
tested 10/24/2016

This script can be set to run every X days (under "Resources" -> "Current project's triggers").

Update this script to further customize emails based on user preferences e.g.

 1. [Default] Send email reports every X days showing all recalls issued since last run.
 2. Send email reports only when there's been 1 or more product matches since last run,
    show all recalls issued since last email report.
 3. Send email reports only when there's been 1 or more product matches since last run,
    only show matching recalls (hide non-matched recalls).


Disclaimers required by the U.S. Consumer Product Safety Commission (CPSC):
http://productsafetyapps.challengepost.com/rules

This product is not developed by or endorsed by CPSC.

THE MATERIAL EMBODIED IN THIS SOFTWARE IS PROVIDED TO YOU "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
EXPRESS, IMPLIED, OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY WARRANTY OF FITNESS FOR A PARTICULAR 
PURPOSE. IN NO EVENT SHALL THE CPSC OR THE UNITED STATES GOVERNMENT BE LIABLE TO YOU OR ANYONE ELSE FOR 
ANY DIRECT, SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER,
INCLUDING WITHOUT LIMITATION, LOSS OF PROFIT, LOSS OF USE, SAVINGS OR REVENUE, OR THE CLAIMS OF THIRD 
PARTIES, WHETHER OR NOT DOC OR THE U.S. GOVERNMENT HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH LOSS, 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, ARISING OUT OF OR IN CONNECTION WITH THE POSSESSION, USE, 
OR PERFORMANCE OF THIS SOFTWARE.

*/

function totalRecall() {
  
  // startDate & endDate can be set dynamically e.g. from last run date to today

  var userProperties = PropertiesService.getUserProperties();
  var lastRunDate = userProperties.getProperty('LAST_RUN_DATE');
  
  var startDate;
  
  startDate = lastRunDate; // dynamic option 

  if (!lastRunDate) {
    startDate = "2016-10-15"; // static override
  }
  
  var todaysDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  var endDate = todaysDate;  

  // get recall information, as of 12/2015
  
  // reference: http://www.cpsc.gov/Global/info/Recall/CPSC-Recalls-Retrieval-Web-Services-Programmers-Guide_3-25-2015.pdf
  /* example json: 
     http://www.saferproducts.gov/restwebservices/Recall?format=json&RecallNumber=16066
     http://www.saferproducts.gov/restwebservices/Recall?format=json&RecallDateStart=2015-12-15
  */

  var url = "http://www.saferproducts.gov/restwebservices/Recall?format=json&RecallDateStart="+startDate+"&RecallDateEnd="+endDate
  var results = JSON.parse(UrlFetchApp.fetch(url));


  // parse JSON 
  
  Logger.log("number of results: "+results.length);

  if (!results || results.length ==0) {
    htmlBody = "No product recalls";
  } else if (results.length==1) {
    htmlBody = "1 product recall";
  } else {
    htmlBody = results.length + " product recalls";
  }
  
  htmlBody += " issued from "+startDate+" to "+endDate+".<br><br>"
  
  // list each product recall and check whether there may be a match against email
  
  var totalMatches = 0;
  
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    
    var recallURL = result['URL'];
    var recallProductName = result['Products'][0]['Name'] // first product name
    

    // first manufacturer name, if available (sometimes it's not available)
    var recallManufacturer = ""
    if (result['Manufacturers'].length > 0) {
       recallManufacturer = " - " + result['Manufacturers'][0]['Name']
    }

    htmlBody += "<a href=\""+ recallURL+ "\">" + recallProductName + recallManufacturer + "</a>";
    
    
    // get matching email threads
    
    var threads = GmailApp.search(recallProductName);
    if (threads.length>0) {
      totalMatches++;
      htmlBody += " <font color=\"red\">(Match! Please check if you have this product)</font> ";
    }

    htmlBody += "<br><br>";

    
  }
  
  // send email report
  
  var subject = 'Total Recall - Found ';
  
  if (results.length==1) {
    subject += '1 Recall, ';
  } else {
    subject += results.length + ' Recalls, ';
  }

  if (totalMatches==1) {
    subject += totalMatches + ' Match';
  } else {
    subject += totalMatches + ' Matches';
  }

  
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: subject,
    htmlBody: htmlBody,
  });
  
  // set properties
  userProperties.setProperty('LAST_RUN_DATE', todaysDate);
  userProperties.setProperty('LAST_EMAIL_DATE', todaysDate);

}