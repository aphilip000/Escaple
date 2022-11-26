

# Comments: 
    - Functions: 
        - Short description
        - Explanation of parameters/return value
        - Precondition(s)
        - Clarify what is happening at certain points in the function
    - Variables:
        - Purpose declared on same line if necessary
        - Grouped with similar variables when possible
# Indenting:
    - Single line loop/if statements are indented for readability
    - Brackets ({}) are placed on the same line when possible
    - Consective functions ARE indented
    - Consecutive variables are NOT indented (assuming they are related)
    - Very long single line statements involving lots of operations will 
      be separated by said operations and indented properly
        - eg. HTML elements are indented based on position in the hierarchy
# Line Length:
    - No strict rules, but lines involving lots of operations are broken up
    - Line length and readability > minimizing file length
# Naming:
    - Kind of following camel case but not really
        - Functions: lowerUpper
        - Variables: (letter)_AllCapitalized
            - Character indicates what the variable is associated with
                - i: Input (parameter)
                - p: Puzzle
                - v: solVe since s usually indicates static
                - e: HTML Element
                - h: helper (since I don't know what else to put)
                - o: output
                - c: constant
                - (none): local variable