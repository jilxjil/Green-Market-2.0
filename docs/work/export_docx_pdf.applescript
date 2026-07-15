set inputPath to "/Users/jeka/Downloads/Projects/green-market2.0/docs/output/green_market_chapter_one_tailored.docx"
set outputPath to "/Users/jeka/Downloads/Projects/green-market2.0/docs/output/green_market_chapter_one_tailored.pdf"

tell application "Microsoft Word"
	activate
	open inputPath
	set activeDoc to active document
	save as activeDoc file name outputPath file format format PDF
	close activeDoc saving no
end tell
