def get_id_of_tuple(fund_type,tuple_to_search):
    for id,type in tuple_to_search:
        if(type.lower()==fund_type.lower()):
            return id

def get_object_or_none(Model,key,value):
    obj=None
    
    if key=='domicile':
        try:
            obj=Model.objects.get(country_name=value)
        except:
            obj=None
    elif key=='report_currency':
        try:
            obj=Model.objects.get(currency=value)
        except:
            obj=None
    elif key=='product_type':
        try:
            obj=Model.objects.get(product_type_name=value)
        except:
            obj=None
    elif key=='reporting_frequency':
        try:
            obj=Model.objects.get(reporting_frequency_name=value)
        except:
            obj=None
    elif key=='ReclassificationFrequency':
        try:
            obj=Model.objects.get(reclassification_frequency_name=value)
        except:
            obj=None
    elif key=='Bank':
        try:
            obj=Model.objects.get(Bank_name=value)
        except:
            obj=None
    elif key=='None':
        try:
            obj=Model.objects.get(pk=value)
        except:
            obj=None

    
    return obj


