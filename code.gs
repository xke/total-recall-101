/*

Total Recall 101
by @xianke for http://productsafetyapps.challengepost.com/

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
  
  // userId is the application key from the U.S. Consumer Product Safety Commission
  
  var userId = "9cf309fe-0c0d-47aa-9520-64b785048df7";

  // startDate & endDate can be set dynamically e.g. from last run date to today

  var userProperties = PropertiesService.getUserProperties();
  var lastRunDate = userProperties.getProperty('LAST_RUN_DATE');
  
  var startDate;
  
  startDate = lastRunDate; // dynamic option 

  if (!lastRunDate) {
    startDate = "2014-05-21"; // static override
  }

  var todaysDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  var endDate = todaysDate;  

  // get recall information
  
  var url = "http://www.cpsc.gov/cgibin/CPSCUpcWS/CPSCUpcSvc.asmx/getRecallByDate?startDate="+startDate+"&endDate="+endDate+"&userId="+userId+"&password="
  var xml = UrlFetchApp.fetch(url);

  // example XML:
  /*
  <?xml version="1.0" encoding="utf-8"?>
  <message outcome="success" transactionID="5C471C62-1160-4025-B6AB-0AE884C7CA5D">
  <results>
  <result UPC="" recallNo="14187" recallURL="http://cs.cpsc.gov/ConceptDemo/SearchCPSC.aspx?SearchCategory=Recalls%20News%20Releases&amp;category=995,1098,990,991,992,993,994,1031&amp;autodisplay=true&amp;query=14187" recDate="2014-05-21" y2k="114187" manufacturer="Nest Labs" type="Smoke Detectors/Alarms" prname="Nest Protect: Smoke + CO Alarm" hazard="Safety Equipment Malfunction" country_mfg="China" />
  </results>
  </message>
  */
  
  // parse XML 
  
  var document = XmlService.parse(xml);
  var results = document.getRootElement().getChild('results').getChildren('result');

  //Logger.log("number of results: "+results.length);

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
    
    var recallManufacturer = result.getAttribute('manufacturer').getValue();
    var recallURL = result.getAttribute('recallURL').getValue();
    var recallPrname = result.getAttribute('prname').getValue();
    
    //Logger.log(recallPrname);
    //Logger.log(recallURL);

    htmlBody += "<a href=\""+ recallURL+ "\">" + recallManufacturer + " - " + recallPrname + "</a>";
    
    
    // get matching email threads
    
    var threads = GmailApp.search(recallPrname);
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

