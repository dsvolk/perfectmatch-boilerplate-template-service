export class TransformerUtils {
  /**
   * This method checks if the array is defined and returns the mapped array if so
   * @param array the unmapped array
   * @param transformationMethod the transformation method
   * @return the transformed array
   */
  public static transformArray<T, K>(array: T[], transformationMethod: (object: T) => K): K[] {
    return array?.map((object: T) => TransformerUtils.transform(object, transformationMethod)) || [];
  }

  /**
   * This method checks if the object is defined and returns the mapped object if so
   * @param object the unmapped object
   * @param transformationMethod the transformation method
   * @return the transformed object
   */
  public static transform<T, K>(object: T, transformationMethod: (object: T) => K): K {
    if (!object) {
      return undefined;
    }

    return transformationMethod(object);
  }
}
