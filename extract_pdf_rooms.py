import PyPDF2
import re
import json

# Path to your PDF
pdf_path = r"C:\Users\alici\Downloads\ruimteboek_alle locaties almere.pdf"

try:
    # Open and read the PDF
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        print(f"Total pages: {len(pdf_reader.pages)}\n")
        
        # Extract text from all pages
        all_text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            all_text += text + "\n"
            
            # Print first few pages to see structure
            if page_num < 3:
                print(f"=== Page {page_num + 1} ===")
                print(text[:500])
                print("\n")
        
        # Save all text to a file for analysis
        with open('extracted_rooms.txt', 'w', encoding='utf-8') as f:
            f.write(all_text)
        
        print("Text extracted and saved to 'extracted_rooms.txt'")
        
        # Try to find room patterns (e.g., AC1.18, AC2.01, etc.)
        room_pattern = r'AC\d+\.\d+'
        rooms = re.findall(room_pattern, all_text)
        unique_rooms = sorted(set(rooms))
        
        print(f"\nFound {len(unique_rooms)} unique rooms:")
        for room in unique_rooms[:20]:  # Show first 20
            print(f"  - {room}")
        
        if len(unique_rooms) > 20:
            print(f"  ... and {len(unique_rooms) - 20} more")
        
        # Save rooms to JSON
        with open('rooms_list.json', 'w', encoding='utf-8') as f:
            json.dump(unique_rooms, f, indent=2)
        
        print("\nRooms list saved to 'rooms_list.json'")

except FileNotFoundError:
    print(f"Error: PDF file not found at {pdf_path}")
    print("Please verify the file path is correct.")
except Exception as e:
    print(f"Error: {e}")
    print("\nTrying to install PyPDF2...")
    import subprocess
    subprocess.run(['pip', 'install', 'PyPDF2'])
