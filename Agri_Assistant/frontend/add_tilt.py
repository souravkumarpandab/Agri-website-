import re
import os

# Configuration: (File Path, Pattern to find the card, wrapping Tilt settings)
files_to_process = [
    {
        "path": r"d:\4th year\Agri_Assistant\Agri_Assistant\frontend\src\pages\Dashboard.jsx",
        "pattern": r'(<motion\.div className="card".*?>.*?</motion\.div>)',
        "tilt_params": 'tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02}'
    },
    {
        "path": r"d:\4th year\Agri_Assistant\Agri_Assistant\frontend\src\pages\DigitalFarming.jsx",
        "pattern": r'(<motion\.div className="tech-card.*?".*?>.*?</motion\.div>)',
        "tilt_params": 'perspective={1000} scale={1.05} gyroscope={true}'
    },
    {
        "path": r"d:\4th year\Agri_Assistant\Agri_Assistant\frontend\src\pages\OrganicTips.jsx",
        "pattern": r'(<motion\.div className="tip-card.*?".*?>.*?</motion\.div>)',
        "tilt_params": 'tiltMaxAngleX={15} tiltMaxAngleY={15} transitionSpeed={2500}'
    },
]

def process_files():
    for file_info in files_to_process:
        filepath = file_info["path"]
        
        if not os.path.exists(filepath):
            print(f"⚠️ Skipping: {filepath} (File not found)")
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. Add the Import if missing
            if "import Tilt" not in content:
                # Inserts after the first React import line
                content = re.sub(r"(import .*?React.*?;\n)", r"\1import Tilt from 'react-parallax-tilt';\n", content, count=1)

            # 2. Check if already wrapped to avoid double-wrapping
            if "<Tilt" in content and file_info["pattern"] in content:
                print(f"ℹ️ {os.path.basename(filepath)} already seems to have Tilt. Skipping wrapping.")
            else:
                # 3. Apply the wrapping
                # Using DOTALL to ensure the '.*?' matches newlines between the motion.div tags
                replacement = f'<Tilt {file_info["tilt_params"]}>\n\\1\n</Tilt>'
                new_content = re.sub(file_info["pattern"], replacement, content, flags=re.DOTALL)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Successfully processed: {os.path.basename(filepath)}")

        except Exception as e:
            print(f"❌ Error processing {filepath}: {e}")

if __name__ == "__main__":
    process_files()
    print("\nAll tasks complete.")