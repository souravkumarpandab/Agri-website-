import shutil
import os

src1 = r"C:\Users\soura\.gemini\antigravity\brain\2ef0084a-3105-40a2-9cd2-3b9419721484\crop_recommendation_ui_1773986819261.png"
dst1 = r"d:\4th year\Agri_Assistant\Agri_Assistant\frontend\public\image\crop_bg.png"

src2 = r"C:\Users\soura\.gemini\antigravity\brain\2ef0084a-3105-40a2-9cd2-3b9419721484\market_prices_ui_1773986835498.png"
dst2 = r"d:\4th year\Agri_Assistant\Agri_Assistant\frontend\public\image\mandi_bg.png"

os.makedirs(os.path.dirname(dst1), exist_ok=True)
shutil.copyfile(src1, dst1)
shutil.copyfile(src2, dst2)
print("Copied images successfully!")
