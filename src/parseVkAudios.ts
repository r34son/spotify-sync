export const parseVkAudiosScript = `(async () => {
  const spinner = document.querySelector('.CatalogBlock__autoListLoader');
  let pageHeight = 0;
  do {
    pageHeight = document.body.clientHeight;
    window.scrollTo({ top: pageHeight })
    await new Promise((r) => setTimeout(r, 400));
  } while (
    pageHeight < document.body.clientHeight ||
    spinner?.style.display === ''
  );

  const audios = [...document.querySelectorAll('.audio_row__performer_title')].map(
    (row) => {
      const [artist, title] = ['.audio_row__performers', '.audio_row__title']
        .map(selector => row.querySelector(selector)?.textContent || '')
        .map((v) => v.replace(/[\\s\\n ]+/g, ' ').trim());

      return [artist, title].join(' - ');
    },
  );
  window.open().document.write(audios.join('</br>'));
})();`;
