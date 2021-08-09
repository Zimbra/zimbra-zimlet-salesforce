import { createElement } from 'preact';
import { Text } from 'preact-i18n';
import { ModalDialog, ActionMenuItem, NakedButton } from '@zimbra-client/components';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import style from './style';
import { route } from 'preact-router';

function createMore(props, context) {
   return (
      <div>
         <ActionMenuItem onClick={e => handleClick(props, context)}>
            <Text id={`zimbra-zimlet-salesforce.menuItem`} />
         </ActionMenuItem>
      </div>

   );
}

function handleClick(props, context) {
   //read zimlet config
   const zimlets = context.getAccount().zimlets
   let globalConfig = new Map();
   const zimlet = zimlets.zimlet.find(zimlet => zimlet.zimlet[0].name === "zimbra-zimlet-salesforce");
   if (zimlet) {
      const gc = zimlet.zimletConfig[0].global[0].property || [];
      for (var i = 0; i < gc.length; i++) {
          globalConfig.set(gc[i].name, gc[i].content);
      };
   }

   //get newest emailData in case we have conversation view enabled
   var emailData = props.emailData;

   //A conversation is selected, take newest message
   try {
      if(Array.isArray(props.emailData.messages))
      {
         emailData = props.emailData.messages[props.emailData.messages.length-1];
      }
   } catch(err){
      console.log('email2case at to conversation error:');
      console.log(err);
   }

   let mailbody = "";
   try {
      if(emailData.html)
      {
         mailbody = convertHtmlToText(emailData.html);
      }
      else if(emailData.text)
      {
         mailbody = emailData.text;
      }
   } catch (err)
   {
      console.log('email2case at h2p error:');
      console.log(err);
   }

   //do the email to case REST call
   //borrowed from classic UI Zimlet
   var url = "https://" + globalConfig.get('sfsubdomain') + ".salesforce.com/500/e?retURL=/500/o" +
   encodeURI("?cas3=") + encodeURI(emailData.from[0].displayName) +
   encodeURI("&cas14=") + encodeURIComponent(emailData.subject) +
   encodeURI("&cas15=") +encodeURIComponent(makeHeader(emailData)) + encodeURIComponent(mailbody.substring(0, 1800));
   window.parent.open(url);
}

/* Tiny function to add email to/cc/date to the Salesforce case.
 * 
 * */
function makeHeader(emailData) {
   let text = "";
   for (var i=0; i<emailData.from.length; i++) {
     text = text + "From: " + (emailData.from[i].name ? emailData.from[i].name + " " : "") + emailData.from[i].address + "\r\n";
   }
   for (var i=0; i<emailData.to.length; i++) {
     text = text + "To: " + (emailData.to[i].name ? emailData.to[i].name + " " : "") + emailData.to[i].address + "\r\n";
   }
   text = text + "Date: " + new Date(emailData.date).toLocaleString() + "\r\n";
   return text;
}

/* https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
 * 
 * */
function convertHtmlToText(html) {
   let tmp = document.createElement("DIV");
    html=html.replace(/<br>/gi, "\n");
    html=html.replace(/<br\s\/>/gi, "\n");
    html=html.replace(/<br\/>/gi, "\n");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

export default compose(
   withIntl()
)
   (
      createMore
   )
