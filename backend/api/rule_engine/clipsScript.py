import clips
import clips.environment
import sys

# Cost
# Capacity
# Availability
# Ratings
# Category
arrayOfVendors = [
  '(vendor (id "66631ef121a0c24d8fb03cbf") (name "Region Events") (location "San Luis Obispo") (service-type "Venue") (availability "Monday" "Tuesday" "Wednesday" "Thursday" "Friday") (capacity 500) (cost 5000) (customer-ratings 4.5))',
  '(vendor (id "66631ef121a0c24d8fb03cc8") (name "Elks Lodge") (location "San Luis Obispo") (service-type "Venue") (availability "Saturday" "Sunday") (capacity 300) (cost 3000) (customer-ratings 3.5))',
  '(vendor (id "66631ef121a0c24d8fb03cce") (name "Avila Beach Resort") (location "Avila Beach") (service-type "Venue") (availability "Friday" "Saturday") (capacity 250) (cost 7000) (customer-ratings 4.6))',
  '(vendor (id "66631ef121a0c24d8fb03cd4") (name "SLO Brew Rock") (location "San Luis Obispo") (service-type "Venue") (availability "Thursday" "Friday" "Saturday") (capacity 400) (cost 4000) (customer-ratings 3.9))',
  '(vendor (id "66631ef121a0c24d8fb03cdc") (name "Mariachi San Luis") (location "San Luis Obispo") (service-type "Entertainment") (availability "Friday" "Saturday" "Sunday") (capacity 0) (cost 1000) (customer-ratings 4.9))',
  '(vendor (id "66631ef121a0c24d8fb03ce3") (name "DJ Kramer") (location "Santa Maria") (service-type "Entertainment") (availability "Friday" "Saturday" "Sunday") (capacity 0) (cost 1375) (customer-ratings 4.5))',
  '(vendor (id "66631ef121a0c24d8fb03cea") (name "The Wavebreakers Band") (location "Paso Robles") (service-type "Entertainment") (availability "Saturday" "Sunday") (capacity 0) (cost 1750) (customer-ratings 3.4))',
  '(vendor (id "66631ef121a0c24d8fb03cf0") (name "Fresno Rodeo") (location "San Luis Obispo") (service-type "Entertainment") (availability "Friday" "Saturday" "Sunday") (capacity 0) (cost 1000) (customer-ratings 4.1))',
  '(vendor (id "66631ef121a0c24d8fb03cf7") (name "SLO Bounce Co") (location "Templeton") (service-type "Entertainment") (availability "Friday" "Saturday" "Sunday") (capacity 0) (cost 750) (customer-ratings 2.9))',
  '(vendor (id "66631ef121a0c24d8fb03cff") (name "Taqueria 805") (location "San Luis Obispo") (service-type "Catering") (availability "Friday" "Saturday" "Sunday") (capacity 100) (cost 60) (customer-ratings 4.8))',
  '(vendor (id "66631ef121a0c24d8fb03d06") (name "Popolo Catering") (location "Santa Maria") (service-type "Catering") (availability "Friday" "Saturday" "Sunday") (capacity 200) (cost 125) (customer-ratings 4.9))',
  '(vendor (id "66631ef121a0c24d8fb03d0d") (name "SLO Bartenders") (location "San Luis Obispo") (service-type "Catering") (availability "Friday" "Saturday" "Sunday") (capacity 50) (cost 250) (customer-ratings 3.8))',
  '(vendor (id "66631ef121a0c24d8fb03d14") (name "Central Coast Catering") (location "Arroyo Grande") (service-type "Catering") (availability "Friday" "Saturday" "Sunday") (capacity 100) (cost 150) (customer-ratings 4.1))'
]

matchy = '(event (type "Venue") (date "Monday") (location "San Luis Obispo") (guest-capacity 100) (budget 10000))'


typeEvent = "Venue"

tempMatch = """
(deffacts eventStfuff """ + matchy + ")" 

deftemplateEvent = """
(deftemplate event
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

#tempMatch = """
#(deffacts eventsss
#(event (id "a") (type "Venue") (date "Monday") (location "San Luis Obispo") (guest-capacity 500) (budget 10000))
#)"""


DEFRULE_Venue = """
(defrule best-venue
(event (type "Venue") (date ?matchDate) (location ?matchLocation) (guest-capacity ?matchCap) (budget ?matchBudget))
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
(event (type "Catering") (date ?matchDate) (location ?matchLocation) (guest-capacity ?matchCap) (budget ?matchBudget))
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
(event (type ?matchType) (date ?matchDate) (location ?matchLocation) (guest-capacity ?matchCap) (budget ?matchBudget))
(vendor (id ?vendorID) (location ?vendorLocation) (service-type ?vendorType) (availability $?avail) (cost ?vendorCost) (capacity ?vendorCap) (customer-ratings ?ratings))
(test (eq ?vendorType ?matchType))
(test (eq ?matchLocation ?vendorLocation))
(test (>= ?matchBudget ?vendorCost))
(test (member$ ?matchDate ?avail))
(test (>= ?ratings 3.5))
=> 
(printout t "ID: " ?vendorID crlf)
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

if typeEvent == "Venue":
  DEFRULE_main = DEFRULE_Venue
elif typeEvent == "Entertainment":
  DEFRULE_main = DEFRULE_Entertainment
else:
  DEFRULE_main = DEFRULE_Catering

env.build(DEFRULE_main)
env.reset()

template = env.find_template('vendor')

env.run()
