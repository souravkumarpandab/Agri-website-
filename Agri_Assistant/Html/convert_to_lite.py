import tensorflow as tf

# Load your big model
model = tf.keras.models.load_model('agri_smart_full_model.h5')

# Convert it to TFLite (Lightweight version)
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the new small file
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)

print("Success! Created 'model.tflite'")