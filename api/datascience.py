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

def calculate_trendline(x: list, y: list, pearsons: float) -> tuple[float, float]: # slope, offset (y = ax+b, where a=slope, b=offset)
    mean_x = mean(x)
    mean_y = mean(y)
    std_x = std(x)
    std_y = std(y)

    # slope en interceptie van pearsons
    # https://math.stackexchange.com/questions/204020/what-is-the-equation-used-to-calculate-a-linear-trendline
    # wat berekenen we? we pakken eerst onze coefficient, dan volgen we deze formules:
    # Eerst de slope (m) berekenen. m = r * (std(y) / std(y)). 
    # Dan de y-inercept met de y-as berekenen:
    # b = gemiddelde van Y, min m, X gemiddelde van X.
    m = float(r * (std_y / std_x))
    b = float(mean_y - m * mean_x)
    return (m, b)

slope, offset = calculate_trendline(x_1, y_1, r)