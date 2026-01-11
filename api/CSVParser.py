# Kai Beckers
# 2025

from typing import List, Dict, TextIO
from enum import Enum
from abc import abstractmethod
from datetime import datetime
import string

class WriteFeedbackStates(Enum):
    Error = 0
    Success = 1

CsvRowData = Dict[str, str] # column: value
CsvRows = List[CsvRowData]
ColumnsArray = List[str]

# The following number of functions describe a data flow. That means it expects consistent inputs.  
# There are enough safeguards in place against formatting errors, however if you want to break it: you will. 
# Assertions are included in the same for loops as operations. It makes it less readable but also a bit more efficient most of the time.

def sanitize_file(file: str, column_separator: str, newline_separator: str) -> str:
    allowed_chars = set(string.printable) | {column_separator, newline_separator}
    allowed_chars -= set('\r\t\x0b\x0c')
    return ''.join(char for char in file if char in allowed_chars)

# Returns:
# - Rows {Column Title: Value}
# - Array of Column Titles
# Reading
def csv_string_to_array(string: str, column_separator: str, row_separator: str) -> tuple[CsvRows, ColumnsArray]:
    string = sanitize_file(string, column_separator, row_separator)
    rows = string.split(row_separator)
    column_titles: List = rows[0].split(column_separator) # row 0 specifies column titles. In order.

    # create a datastructure where each entry is a Row, with the type of a Dictionary, Column Title to Value. Refer to the CsvRows datatype.
    pythonic_rows = []
    for i in range(1, rows.__len__()):                # index from row 1 (skipping column titles) to the end of the file.
        row = rows[i] 
        row_values = row.split(column_separator)
        struct = {}     
        if row.__len__() == 0: # indicates trailing space/empty row. This is normal. So we don't have to exit.
            continue
        elif not row_values.__len__() == column_titles.__len__():
            raise Exception('Invalid Row encountered. Did you add a trailing separator?') # Mismatch between values and defined columns means there has been a formatting error.
        
        for j in range(0, row_values.__len__()):      # Iterate over each row's columns with values in them.
            value = row_values[j]
            struct[column_titles[j]] = value          # column titles are in the same order as values. so we can directly reference them.

        pythonic_rows.append(struct)

    return (pythonic_rows, column_titles)

# no columns row
def txt_string_to_array_no_columns(string: str, column_separator: str, row_separator: str, column_titles: ColumnsArray) -> tuple[CsvRows, ColumnsArray]:
    string = sanitize_file(string, column_separator, row_separator)
    rows = string.split(row_separator)

    # create a datastructure where each entry is a Row, with the type of a Dictionary, Column Title to Value. Refer to the CsvRows datatype.
    pythonic_rows = []
    for i in range(0, rows.__len__()):                # index from row 1 (skipping column titles) to the end of the file.
        row = rows[i] 
        row_values = row.split(column_separator)
        struct = {}     
        if row.__len__() == 0: # indicates trailing space/empty row. This is normal. So we don't have to exit.
            continue
        elif not row_values.__len__() == column_titles.__len__():
            raise Exception('Invalid Row encountered (column-row field amount mismatch). Did you add a trailing separator?') # Mismatch between values and defined columns means there has been a formatting error.
        
        for j in range(0, row_values.__len__()):      # Iterate over each row's columns with values in them.
            value = row_values[j]
            struct[column_titles[j]] = value          # column titles are in the same order as values. so we can directly reference them.

        pythonic_rows.append(struct)

    return (pythonic_rows, column_titles)


# Writing
def write_csv_array_to_file(file: TextIO, structure: CsvRows, columns: ColumnsArray, column_separator: str, row_separator: str) -> WriteFeedbackStates:
    full_string = ""

    # first row is the column definition, so we establish the string for that first.
    column_string = ""
    columns_amount = columns.__len__()
    for i in range(0, columns_amount):
        column = columns[i]
        column_string += column
        if i == columns_amount - 1: # if this is the last column we place a Row separator instead. (e.g. a newline)
            column_string += row_separator
        else:
            column_string += column_separator

    # next rows are values
    # Python sorts dictionaries by creation. So the order can differ.
    # We create a temporary Name to Position mapping
    column_title_to_pos: Dict[str, int] = {}
    for i in range(0, columns_amount):
        column = columns[i]
        column_title_to_pos[column] = i

    # then we start constructing our string
    data_string = ""
    for row in structure:
        # we first establish all rows and their values. We do this because values can be empty or out of order. So we put them IN order.
        ordered_struct: Dict[int, str] = {}
        for column_name, value in row.items():
            if not column_name in column_title_to_pos:
                raise Exception('A row defined a column that is not in the columns parameter. Ensure your columns are properly defined and your row is of valid format.')

            correct_index = column_title_to_pos[column_name]
            ordered_struct[correct_index] = value

        # we then iterate over each column, and if we have a dictionary entry for it, we add the value. If we dont, we just add a row separator.
        row_string = ""
        for i in range(0, columns_amount):
            # add value if we have a dict entry for it.
            if i in ordered_struct:
                row_string += ordered_struct[i]

            if i == columns_amount - 1: # if this is the last column we place a Row separator instead. (e.g. a newline)
                row_string += row_separator
            else:
                row_string += column_separator
        data_string += row_string

    full_string += column_string
    full_string += data_string
    try:
        file.seek(0)
        file.write(full_string)
        file.truncate()
        file.flush()
    except:
        return WriteFeedbackStates.Error
    return WriteFeedbackStates.Success

def write_txt_array_to_file_no_columns(file: TextIO, structure: CsvRows, columns: ColumnsArray, column_separator: str, row_separator: str) -> WriteFeedbackStates:
    full_string = ""

    # we first establish the correct amount of columns.
    columns_amount = columns.__len__()

    # next rows are values
    # Python sorts dictionaries by creation. So the order can differ.
    # We create a temporary Name to Position mapping
    column_title_to_pos: Dict[str, int] = {}
    for i in range(0, columns_amount):
        column = columns[i]
        column_title_to_pos[column] = i

    # then we start constructing our string
    data_string = ""
    for row in structure:
        # we first establish all rows and their values. We do this because values can be empty or out of order. So we put them IN order.
        ordered_struct: Dict[int, str] = {}
        for column_name, value in row.items():
            if not column_name in column_title_to_pos:
                raise Exception('A row defined a column that is not in the columns parameter. Ensure your columns are properly defined and your row is of valid format.')

            correct_index = column_title_to_pos[column_name]
            ordered_struct[correct_index] = value

        # we then iterate over each column, and if we have a dictionary entry for it, we add the value. If we dont, we just add a row separator.
        row_string = ""
        for i in range(0, columns_amount):
            # add value if we have a dict entry for it.
            if i in ordered_struct:
                row_string += ordered_struct[i]

            if i == columns_amount - 1: # if this is the last column we place a Row separator instead. (e.g. a newline)
                row_string += row_separator
            else:
                row_string += column_separator
        data_string += row_string

    full_string += data_string
    try:
        file.seek(0)
        file.write(full_string)
        file.truncate()
        file.flush()
    except Exception as e:
        return WriteFeedbackStates.Error
    return WriteFeedbackStates.Success

# test
#with open('./kluizen.csv') as f:
#    time1 = datetime.now()
#    string = str(f.read())
#    array, columns = csv_string_to_array(string, ";", "\n")
#    print(array.__str__())
#    array.append({"in_gebruik": "1", "id": "6"})
#    write_csv_array_to_file("", array, columns, ";", "\n")
#    time2 = datetime.now()
#    print((time2 - time1).total_seconds())





























# Our CsvContext maintains file integrity, all read-write file operations and maintains the ORM State Hash.
# The Queryables are specific subobjects that maintain indices of the master row. Think of it like a SQL View.
# Queryables are state bound and recompute when their Row map hash differs from the ORM Sttate Hash.
# If a Queryable is behind a state, it first resynchronizes then updates its operation.
#class CsvContext:
#    # on-initialize fields, always available
#    column_separator: str
#    row_separator: str
#
#    # file
#    file = ""
#    file_integrity_hash: str
#
#    # ORM live-lookup details
#    columns: List[str]
#    primary_column: str
#    __rows: List[Dict[str, str]]
#
#    def __init__(self, file_ref: str, column_separator: str, row_separator: str):
#        # we run some input and file validations in here
#        file = open(file_ref)
#        # TODO: we check for file type, validity.
#        # calculate file integrity hash, this is a TODO because its not absolutely required for the assignment.
#        self.file_integrity_hash = ""
#        self.file = file
#        self.column_separator = column_separator
#        self.row_separator = row_separator
#        self.__rows = csv_string_to_array(str(self.file), column_separator, row_separator)
#
#    # file operations
#    def ensure_consistent_file_state(self):
#        pass
#
#    def write_cache_to_file(self):
#        pass
#
#    def get_rows(self) -> List[Dict[str, str]]:
#        return []