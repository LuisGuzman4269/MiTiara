import clips
import clips.environment
import sys

# Cost
# Capacity
# Availability
# Ratings
# Category
arrayOfVendors = sys.argv[2]
matchy = sys.argv[1]

tempMatch = """
(deffacts eventStfuff """ + matchy + ")" 

deftemplateEvent = """
(deftemplate event
  (slot id (type STRING))
  (slot type (type STRING))
  (slot date (type STRING))
  (slot location (type STRING))
  (slot guest-capacity (type INTEGER))
  (slot budget (type INTEGER)))
"""

deftemplateVendor = """
(deftemplate vendor
  (slot id (type STRING))
  (slot name (type STRING))
  (slot location (type STRING))
  (slot service-type (type STRING))
  (multislot availability (type STRING))
  (slot cost (type INTEGER))
  (slot capacity (type INTEGER))
  (slot customer-ratings (type FLOAT)))
"""

deftemplateMatch = """
(deftemplate match
  (slot vendor-id (type STRING)))
"""

deftInserts = """
(deffacts vendorsInitials
"""

tempMatch = """
(deffacts eventsss
(event (id "a") (type "Venue") (date "Monday") (location "San Luis Obispo") (guest-capacity 500) (budget 10000))
)"""


DEFRULE_Venue = """
(defrule best-venue
(event (id ?matchID) (type "Venue") (date ?matchDate) (location ?matchLocation) (guest-capacity ?matchCap) (budget ?matchBudget))
(vendor (id ?vendorID) (location ?vendorLocation) (service-type "Venue") (availability $?avail) (cost ?vendorCost) (capacity ?vendorCap) (customer-ratings ?ratings))
(test (eq ?matchLocation ?vendorLocation))
(test (>= ?matchBudget ?vendorCost))
(test (member$ ?matchDate ?avail))
(test (>= ?ratings 3.5))
(test (<= ?matchCap ?vendorCap))
=> 
(printout t "IT WORKED! " ?vendorID crlf)
(assert (match (vendor-id ?vendorID)))
)"""

DEFRULE_Catering = """
(defrule best-venue
(event (id ?matchID) (type "Catering") (date ?matchDate) (location ?matchLocation) (guest-capacity ?matchCap) (budget ?matchBudget))
(vendor (id ?vendorID) (location ?vendorLocation) (service-type "Catering") (availability $?avail) (cost ?vendorCost) (capacity ?vendorCap) (customer-ratings ?ratings))
(test (eq ?matchLocation ?vendorLocation))
(test (>= ?matchBudget ?vendorCost))
(test (member$ ?matchDate ?avail))
(test (>= ?ratings 3.5))
(test (<= ?matchCap ?vendorCap))
=> 
(printout t "IT WORKED! " ?vendorID crlf)
(assert (match (vendor-id ?vendorID)))
)"""


DEFRULE_Entertainment= """
(defrule best-venue
(event (id ?matchID) (type ?matchType) (date ?matchDate) (location ?matchLocation) (guest-capacity ?matchCap) (budget ?matchBudget))
(vendor (id ?vendorID) (location ?vendorLocation) (service-type ?vendorType) (availability $?avail) (cost ?vendorCost) (capacity ?vendorCap) (customer-ratings ?ratings))
(test (eq ?vendorType ?matchType))
(test (eq ?matchLocation ?vendorLocation))
(test (>= ?matchBudget ?vendorCost))
(test (member$ ?matchDate ?avail))
(test (>= ?ratings 3.5))
=> 
(printout t "IT WORKED! " ?vendorID crlf)
(assert (match (vendor-id ?vendorID)))
)"""

for i in arrayOfVendors:
    deftInserts = deftInserts + i + "\n"

deftInserts = deftInserts + "\n)"

env = clips.Environment()

env.build(deftemplateVendor)
env.build(deftemplateEvent)
env.build(deftemplateMatch)
env.build(deftInserts)
env.build(tempMatch)
env.build(DEFRULE_Venue)
env.build(DEFRULE_Entertainment)
env.build(DEFRULE_Catering)
env.reset()

template = env.find_template('vendor')

env.run()


for i in env.facts():
    print(i)