var fs = require('fs');
var filepath = 'node_modules/@coachcare/common/material/_theming.scss';

fs.readFile(filepath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  // TODO replace these:
  // _mat-slider-inner-content-theme
  // mat-radio-color
  // mat-chips-theme-color
  // mat-color(map-get($theme, accent))
  // mat-color($primary, 0.26)
  // mat-color($warn)
  // mat-color($primary, lighter), mat-color($accent, lighter), mat-color($warn, lighter)
  // fade-out(mat-color($primary), $mat-datepicker-selected-fade-amount) 0.6

  var searchMap = {
    ' mat-color($primary)': ' var(--primary, mat-color($primary))',
    ' mat-color($primary, default-contrast))':
      ' var(--primary-contrast, mat-color($primary, default-contrast))',
    ' mat-color($accent)': ' var(--accent, mat-color($accent))',
    ' mat-color($foreground, text)':
      ' var(--text, mat-color($foreground, text))',
  };

  var re = new RegExp(Object.keys(searchMap).join('|'), 'g');
  var result = data.replace(re, function (matched) {
    return mapObj[matched];
  });

  fs.writeFile('_theming.scss', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
