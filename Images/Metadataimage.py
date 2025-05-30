import os
import csv
from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime

def get_exif_data(image_path):
    """Extracts relevant EXIF data from an image."""
    exif_data = {}
    try:
        img = Image.open(image_path)
        info = img._getexif()
        if info:
            for tag_id, value in info.items():
                tag_name = TAGS.get(tag_id, tag_id)
                if tag_name in ['DateTimeOriginal', 'DateTimeDigitized', 'DateTime', 'Make', 'Model', 'Software']:
                    if isinstance(value, datetime):
                        exif_data[tag_name] = value.strftime('%Y:%m:%d %H:%M:%S')
                    elif isinstance(value, bytes):
                         try:
                            exif_data[tag_name] = value.decode(errors='replace').strip()
                         except:
                            exif_data[tag_name] = str(value)
                    else:
                        exif_data[tag_name] = str(value).strip()
    except Exception:
        pass
    return exif_data

def process_image_folder(root_folder_path, output_csv_filename="image_metadata_with_folders.csv"):
    """Processes all images in a folder (and subfolders) and saves metadata to a CSV file."""
    image_extensions = ('.jpg', '.jpeg', '.png', '.tif', '.tiff', '.heic', '.heif')
    found_images_metadata = []

    print(f"Scanning folder and subfolders: {root_folder_path}")

    for dirpath, _, filenames in os.walk(root_folder_path):
        for filename in filenames:
            if filename.lower().endswith(image_extensions):
                image_path = os.path.join(dirpath, filename)
                # Get the immediate parent folder name
                parent_folder_name = os.path.basename(dirpath)
                # If the image is in the root_folder_path itself, 
                # os.path.basename(dirpath) might be the last component of root_folder_path.
                # This is usually desired, but if you want it blank for root, add a check:
                # if os.path.normpath(dirpath) == os.path.normpath(root_folder_path):
                #     parent_folder_name = "[ROOT]" # Or an empty string, or the root folder's actual name

                print(f"Processing: {filename} (in folder: {parent_folder_name})")
                metadata = get_exif_data(image_path)
                
                date_taken = metadata.get('DateTimeOriginal', metadata.get('DateTimeDigitized', metadata.get('DateTime')))

                found_images_metadata.append({
                    'Filename': filename,
                    'FolderName': parent_folder_name, # <<<--- NEW COLUMN
                    'FullPath': image_path,
                    'DateTaken': date_taken if date_taken else '',
                    'CameraMake': metadata.get('Make', ''),
                    'CameraModel': metadata.get('Model', ''),
                    'Software': metadata.get('Software', '')
                })

    if not found_images_metadata:
        print("No images found or no metadata extracted in the specified folder or its subfolders.")
        return

    # Define CSV fieldnames including the new "FolderName"
    fieldnames = ['Filename', 'FolderName', 'FullPath', 'DateTaken', 'CameraMake', 'CameraModel', 'Software']
    
    # Save CSV in the root_folder_path (the folder you told the script to scan)
    output_path = os.path.join(root_folder_path, output_csv_filename) 

    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in found_images_metadata:
            writer.writerow(row)
    
    print(f"\nMetadata for {len(found_images_metadata)} images saved to: {output_path}")

if __name__ == "__main__":
    # --- USER CONFIGURATION ---
    # Set this to the TOP-LEVEL folder containing all your event folders and subfolders.
    # The script will scan everything inside this 'master_image_folder'.
    master_image_folder = r"C:\AI Use and Deveopment\Akanksha camp\non selected images" # Example for Windows
    # master_image_folder = "/path/to/your/TOP_LEVEL_image_folder" # Example for macOS/Linux
    
    # OPTION: To process the current directory where the script is run from (and its subfolders).
    # master_image_folder = os.getcwd() 
    # --- END USER CONFIGURATION ---

    if master_image_folder == r"C:\path\to\your\TOP_LEVEL_image_folder" or \
       master_image_folder == "/path/to/your/TOP_LEVEL_image_folder" or \
       master_image_folder == "REPLACE_WITH_YOUR_IMAGES_ROOT_FOLDER_PATH": # Added a generic placeholder
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("!!! PLEASE EDIT THE 'master_image_folder' VARIABLE IN THE SCRIPT               !!!")
        print("!!! TO THE ROOT FOLDER CONTAINING ALL YOUR EVENT SUBFOLDERS WITH IMAGES.       !!!")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    else:
        if os.path.isdir(master_image_folder):
            # The CSV will now be named 'image_metadata_with_folders.csv'
            process_image_folder(master_image_folder, "image_metadata_with_folders.csv")
        else:
            print(f"Error: The specified folder does not exist: {master_image_folder}")
            print("Please edit the 'master_image_folder' variable in the script.")