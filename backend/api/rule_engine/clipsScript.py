import clips

# Cost
# Capacity
# Availability
# Ratings
# Category

deftemplateEvent = """
(deftemplate Event
  (slot id)
  (slot type)
  (slot date)
  (slot location)
  (slot guest-capacity)
  (slot budget))
"""

deftemplateVendor = """
(deftemplate vendor
  (slot id)
  (slot name)
  (slot location)
  (slot service-type)
  (multislot availability)
  (slot cost)
  (slot capacity)
  (slot customer-ratings))
"""

deftemplateMatch = """
(deftemplate match
  (slot event-id)
  (slot vendor-id)
  (slot service-type))
"""

