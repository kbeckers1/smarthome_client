import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.ticker import LinearLocator
from opdracht2 import cor, mean, std
from CSVParser import csv_string_to_array
# https://matplotlib.org/stable/gallery/images_contours_and_fields/image_annotated_heatmap.html

# dus wat we willen:
# we berekenen de lineare regressie van:
#   de buitentemperatuur;
#   bezettingsgraad huis;
#   luchtvochtigheid;
#   het uur van de dag.
# tussen:
#   het kilowattuur verbruik van het huis;
#   

# laad data
csv_bestand = open('./dataset.csv', "rt+")
arr, columns = csv_string_to_array(str(csv_bestand.read()), ',', '\n')
csv_bestand.close()
print(str(columns))

# transform data to lists of floats.
energy_consumption_key = columns[11]
outside_temp_key       = columns[4]
occupancy_key          = columns[7]
humidity_key           = columns[5]
hour_key               = columns[1]

energy_consumption = [ float(x[energy_consumption_key]) for x in arr]
outside_temp =       [ float(x[outside_temp_key])       for x in arr]
occupancy =          [ float(x[occupancy_key])          for x in arr]
humidity =           [ float(x[humidity_key])           for x in arr]
hour =               [ float(x[hour_key])               for x in arr]

print(energy_consumption_key, outside_temp_key, occupancy_key, humidity_key, hour_key)


# BESTE CORRELATIE PLOTS
# 
targetvariabeles = ["Energieverbruik (kWh)"]
featurevariabeles = ["Buitentemperatuur (C)", "Bezettingsgraad (pers.)", "Verwarmingsgraad (C)", "Uur van de dag"]
# 
harvest = np.array([[round(cor(energy_consumption, outside_temp), 3), round(cor(energy_consumption, occupancy), 3), round(cor(energy_consumption, humidity), 3), round(cor(energy_consumption, hour), 3)]])
# fig, ax = plt.subplots()
# im = ax.imshow(harvest)
# 
# # Show all ticks and label them with the respective list entries
# ax.set_xticks(range(len(featurevariabeles)), labels=featurevariabeles,
#               rotation=45, ha="right", rotation_mode="anchor")
# ax.set_yticks(range(len(targetvariabeles)), labels=targetvariabeles)
# 
# # Loop over data dimensions and create text annotations.
# for i in range(len(targetvariabeles)):
#     for j in range(len(featurevariabeles)):
#         text = ax.text(j, i, harvest[i, j],
#                        ha="center", va="center", color="w")
# 
# ax.set_title("Correlatie in Pearson tussen elke featurevariabele en targetvariabele.")
# fig.tight_layout()
# plt.show()

# LINEARE REGRESSIE PLOT VAN DE BESTE CORRELATIE
# find the feature with highest absolute correlation
features = {
    "Buitentemperatuur (C)": outside_temp,
    "Bezettingsgraad (pers.)": occupancy,
    "Verwarmingsgraad (C)": humidity,
    "Uur van de dag": hour
}

# harvest is a 1x4 array
best_idx = max(range(len(harvest[0])), key=lambda i: abs(harvest[0][i]))
best_feature_name = list(features.keys())[best_idx]
best_feature_data = features[best_feature_name]

# calculate regression (https://datasciencepartners.nl/linear-regression-python/)
r: float = harvest[0][best_idx]  # correlatie coefficient
x_1 = best_feature_data
y_1 = energy_consumption

def calculate_trendline(x, y, num_iterations=1000, learning_rate=0.00001) -> tuple[float, float]:
    n = len(x)  
    coefficients: list[float] = [0, 0]
    for _ in range(num_iterations):
        grad_a = 0
        grad_b = 0
        for i in range(n):
            error = (coefficients[0] + coefficients[1] * x[i]) - y[i]
            grad_a += 2 * error
            grad_b += 2 * error * x[i]

        coefficients[0] -= learning_rate * grad_a / n
        coefficients[1] -= learning_rate * grad_b / n

    return coefficients[1], coefficients[0]

slope, offset = calculate_trendline(x_1, y_1)

# export which feature was used so callers (API) can inform clients
feature = best_feature_name