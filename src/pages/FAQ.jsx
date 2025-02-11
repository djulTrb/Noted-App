import React from "react";
import QaA from "../components/QaA";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Faq = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Noted - FAQ</title>
          <meta property="og:title" content="Noted - FAQ" />
          <meta name="twitter:title" content="Noted - FAQ" />
        </Helmet>
      </HelmetProvider>
      <section className="xl:px-10 lg:px-3 xxxs:ml-3 lg:max-xl:pr-6 lg:pt-3 md_to_lg:pt-5 pt-5">
        <h1 className="w-fit lg:text-6xl md_to_lg:text-5xl text-5xl dark:text-stone-200 text-stone-800 tracking-tight font-sourceSans_bl capitalize px-2">
          FaQ
        </h1>
        <ul className="grid xl:grid-cols-2 sm:w-11/12 lg:max-xl:w-10/12 gap-x-14 gap-y-8 md_to_lg:ml-8 md:ml-6 sm:ml-6 md:pt-8 pt-3 pb-10 xxxs:max-sm:pt-8 xxxs:max-sm:px-2">
          <QaA
            question="1. What is this service?"
            answer="This service is a comprehensive tool for managing your notes and personal information. It offers features like note-taking with Markdown support, account modifications (such as changing your password, profile picture, username, and app theme color), and detailed statistics on your notes."
          />
          <QaA
            question="2. How do I sign up?"
            answer="You can sign up by visiting our website and clicking on the 'Get Started' button at the top of the screen. You'll need to provide your email address, create a password, and fill in some basic information about yourself."
          />
          <QaA
            question="3. Can I use this service on my mobile device?"
            answer="Yes, you can access the service through your browser on both desktop and mobile devices without needing to download an app."
          />
          <QaA
            question="4. How do I add a new note?"
            answer="Click on the 'Note+' button in the 'Notes' section. Enter the title, content, and tags for your note in the new screen that appears, then save it to keep track of your thoughts and ideas."
          />
          <QaA
            question="5. Can I modify or delete notes?"
            answer="Yes, you can modify or delete your notes by accessing the note and selecting the appropriate option."
          />
          <QaA
            question="6. Is my data secure?"
            answer="Yes, your data is secure. We use encryption and other security measures to protect your information."
          />
          <QaA
            question="7. How do I customize my dashboard?"
            answer="You can customize your dashboard by adjusting the parameters and settings to suit your preferences."
          />
          <QaA
            question="8. How do I update my profile information?"
            answer="You can update your profile information by going to the 'Settings' tab, selecting 'Account Management,' and pressing 'Modify' to edit your details and save the changes."
          />
          <QaA
            question="9. How do I search and filter notes?"
            answer="You can search and filter notes based on the tags or title in the 'Notes' section."
          />
          <QaA
            question="10. What is the Statistics section for?"
            answer="The Statistics section provides various information and insights about your notes, helping you keep track of your note-taking activity."
          />
          <QaA
            question="11. How can I change the app theme color?"
            answer="You can change the app theme color by going to the 'Settings' tab and choosing your preferred color scheme."
          />
          <QaA
            question="12. How do I reset my password?"
            answer="To reset your password, go to the 'Settings' tab, select 'Account Management,' and follow the instructions to reset your password."
          />
          <QaA
            question="13. Can I add tags to my notes?"
            answer="Yes, you can add tags to your notes when creating or editing a note. Tags help you categorize and easily find your notes."
          />
          <QaA
            question="14. Can I import and export notes?"
            answer="Currently, importing and exporting notes is not supported. However, this feature may be added in future updates."
          />
          <QaA
            question="15. Are there any limits on the number of notes I can create?"
            answer="There are no limits on the number of notes you can create. You can take as many notes as you need."
          />
          <QaA
            question="16. Is there a way to backup my notes?"
            answer="Currently, the app does not support automatic backups. However, we recommend periodically saving important notes to your local storage."
          />
          <QaA
            question="17. Is there a way to backup my notes?"
            answer="Currently, the app does not support automatic backups. However, we recommend periodically saving important notes to your local storage."
          />
          <QaA
            question="18. How do I use Markdown for my notes?"
            answer="You can use Markdown to format your notes by using various syntax elements such as headings, bold text, italic text, lists, and more. For a complete guide on Markdown syntax, you can visit 'https://www.markdownguide.org/basic-syntax/'"
          />
        </ul>
      </section>
    </>
  );
};

export default Faq;
