/**
 * MDT Wiki — Anonymous Contribution Form generator
 * -------------------------------------------------
 * Builds the whole Google Form (questions + anonymity settings + a linked
 * responses spreadsheet) in one click. You do NOT need to touch the Forms UI.
 *
 * HOW TO RUN (about 1 minute, one time):
 *   1. Sign in to Google as mdtwikipedia@gmail.com
 *   2. Go to  https://script.google.com  →  New project
 *   3. Delete the sample code, paste ALL of this file, click Save (disk icon)
 *   4. Press Run (▶). First run asks you to authorize — allow it (it only
 *      touches your own Forms/Drive).
 *   5. Open  View → Logs  (or the Execution log). Copy the two URLs it prints:
 *        • EMBED URL  → paste into index.html (replace REPLACE_WITH_YOUR_FORM_ID)
 *        • EDIT URL   → bookmark this to read/manage responses
 */

function createMdtWikiForm() {
  var form = FormApp.create('MDT Wiki — Anonymous Contribution')
    .setDescription(
      'Add, correct, or update wiki content. This form is anonymous — we do not ' +
      'collect your email or name, only what you type below. Everything is reviewed ' +
      'against the ground rules before it goes live.\n\n' +
      'GROUND RULES: Initials only (no full names). Keep it factual, professional, and ' +
      'constructive. Always include the semester/date.'
    );

  // ---- Anonymity + behaviour settings ----
  form.setCollectEmail(false);            // do not collect email = anonymous
  form.setLimitOneResponsePerUser(false); // avoids forcing a Google sign-in
  form.setAllowResponseEdits(false);
  form.setProgressBar(false);
  try { form.setRequireLogin(false); } catch (e) { /* not applicable on personal accounts */ }

  // ---- Questions ----
  form.addListItem()
    .setTitle('What are you contributing?')
    .setChoiceValues([
      'Module notes (workload, tips, exam format)',
      'Professor profile (teaching style, how to communicate)',
      'FAQ answer',
      'Budget correction',
      'Language course review',
      'Correction / fix to existing content',
      'Other'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Which module, professor, or section is this about?')
    .setHelpText('For professors: INITIALS ONLY, please. Full names are not allowed.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Your contribution')
    .setHelpText('Keep it factual, professional, and constructive. No full names, no slurs, ' +
                 'no personal attacks.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Which semester / date does this apply to?')
    .setHelpText('e.g. "WiSe 2025" or "SoSe 2026". Contributions without a timestamp are denied.')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('Optional: overall rating (if this is a module or professor)')
    .setBounds(1, 5)
    .setLabels('Poor', 'Excellent')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Anything else? (optional)')
    .setRequired(false);

  // ---- Linked responses spreadsheet (only you can see it) ----
  var ss = SpreadsheetApp.create('MDT Wiki — Contribution Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // ---- Output the URLs you need ----
  var publishedUrl = form.getPublishedUrl();
  var embedUrl = publishedUrl.indexOf('?') === -1
    ? publishedUrl + '?embedded=true'
    : publishedUrl + '&embedded=true';

  Logger.log('====================================================');
  Logger.log('EMBED URL (put in index.html iframe src):');
  Logger.log(embedUrl);
  Logger.log('');
  Logger.log('OPEN-IN-NEW-TAB URL (fallback link):');
  Logger.log(publishedUrl);
  Logger.log('');
  Logger.log('EDIT URL (bookmark to manage the form):');
  Logger.log(form.getEditUrl());
  Logger.log('');
  Logger.log('RESPONSES SPREADSHEET:');
  Logger.log(ss.getUrl());
  Logger.log('====================================================');
}
