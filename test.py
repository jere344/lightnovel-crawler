from typing import Union

class A:
    pass

class B:
    pass


a = A()
b = B()

print(isinstance(a, Union[A, B]))