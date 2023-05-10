fs.readdir(dir, (err, files) => {
  no_files = files.length;
  for (i = 0; i < files.length; i++) {
    console.log(no_files);
    output_display.innerHTML +=
      // `<h3>file# ${i}: ${files.na} </h3>`;
      `<h3>file# ${i}:  </h3>`;
  }
});
