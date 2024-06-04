; Define templates for events, vendors, and matches
(deftemplate event
  (slot id)
  (slot type)
  (slot date)
  (slot location)
  (slot guest-capacity)
  (slot budget)
  (slot service-requirements))

(deftemplate vendor
  (slot id)
  (slot name)
  (slot location)
  (slot service-type)
  (slot availability)
  (slot cost)
  (slot capacity)
  (slot range)
  (slot customer-ratings))

(deftemplate match
  (slot event-id)
  (slot vendor-id)
  (slot service-type)
  (slot remaining-budget))

; Define initial facts for an event
(deffacts initial-facts
  (event (id 1) (type "Wedding") (date "2025-12-18") (location "San Luis Obispo")
         (guest-capacity 200) (budget 5000)
         (service-requirements "venue catering entertainment decoration photo-video"))
  (vendor (id 101) (name "Beautiful Venues") (location "San Luis Obispo") (service-type "venue")
          (availability "2025-12-18") (cost 2000) (capacity 250) (range 10) (customer-ratings 4.5))
  (vendor (id 102) (name "Delicious Catering") (location "San Luis Obispo") (service-type "catering")
          (availability "2025-12-18") (cost 1500) (capacity 200) (range 10) (customer-ratings 4.8))
  (vendor (id 103) (name "Awesome DJs") (location "San Luis Obispo") (service-type "entertainment")
          (availability "2025-12-18") (cost 1000) (capacity 200) (range 15) (customer-ratings 4.7))
  (vendor (id 104) (name "Elegant Decorations") (location "San Luis Obispo") (service-type "decoration")
          (availability "2025-12-18") (cost 500) (capacity 200) (range 10) (customer-ratings 4.9))
  (vendor (id 105) (name "Perfect Photos") (location "San Luis Obispo") (service-type "photo-video")
          (availability "2025-12-18") (cost 500) (capacity 200) (range 15) (customer-ratings 4.6)))

; Rule to find matches based on availability, location, and service type
(defrule match-vendor
  (event (id ?eid) (location ?eloc) (service-requirements $?eservices) (date ?edate) (budget ?ebudget) (guest-capacity ?ecapacity))
  (vendor (id ?vid) (location ?vloc&?eloc) (service-type ?stype) (availability $?avails&?edate) (cost ?vcost) (capacity ?vcap) (range ?vrange) (customer-ratings ?vrating))
  (test (member$ ?stype $?eservices))
  (test (>= ?vrating 4.5)) ; Ensure vendor has good ratings
  (test (<= ?vcost ?ebudget)) ; Ensure cost is within the budget
  (test (>= ?vcap ?ecapacity)) ; Ensure capacity meets the requirement
  =>
  (bind ?remaining-budget (- ?ebudget ?vcost))
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type ?stype) (remaining-budget ?remaining-budget)))
  (printout t "Event " ?eid " matches Vendor " ?vid " for service " ?stype " with remaining budget: " ?remaining-budget crlf))

; Rule to print all matches
(defrule print-matches
  (match (event-id ?eid) (vendor-id ?vid) (service-type ?stype) (remaining-budget ?remaining-budget))
  =>
  (printout t "Match found: Event " ?eid " with Vendor " ?vid " for " ?stype ", Remaining Budget: $" ?remaining-budget crlf))

; Additional rules for other service types can be added similarly