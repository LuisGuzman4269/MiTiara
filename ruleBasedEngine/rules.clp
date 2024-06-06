; Define templates for events, vendors, and matches
(deftemplate event
  (slot id)
  (slot type)
  (slot date)
  (slot location)
  (slot guest-capacity)
  (slot budget)
  (multislot service-requirements)
  (multislot priority-ranking)) ; New slot for priority ranking

(deftemplate vendor
  (slot id)
  (slot name)
  (slot location)
  (slot service-type)
  (multislot availability)
  (slot cost)
  (slot capacity)
  (slot range)
  (slot customer-ratings))

(deftemplate match
  (slot event-id)
  (slot vendor-id)
  (slot service-type))

; Define initial facts for an event and vendors
(deffacts initial-facts
  (event (id 1) (type "Wedding") (date "2025-12-18") (location "San Luis Obispo")
         (guest-capacity 200) (budget 5000)
         (service-requirements "venue" "catering" "entertainment" "decoration" "photo-video")
         (priority-ranking "venue" "catering" "entertainment" "decoration" "photo-video"))

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

; Rule to match venue
(defrule match-venue
  (event (id ?eid) (location ?eloc) (service-requirements $?eservices) (date ?edate) (guest-capacity ?ecap) (budget ?ebudget))
  (vendor (id ?vid) (location ?vloc&?eloc) (service-type "venue") (availability $?avails) (cost ?vcost) (capacity ?vcap) (customer-ratings ?vrating))
  (test (member$ "venue" $?eservices))
  (test (member$ ?edate $?avails)) ; Ensure the date is within availability
  (test (>= ?vrating 4.0))  ; Ensure vendor has good ratings
  (test (<= ?vcost ?ebudget))  ; Ensure cost is within the budget
  (test (>= ?vcap ?ecap))  ; Ensure capacity meets the requirement
  =>
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type "venue")))
  (printout t "Event " ?eid " matches Venue Vendor " ?vid crlf))

; Rule to match catering
(defrule match-catering
  (event (id ?eid) (location ?eloc) (service-requirements $?eservices) (date ?edate) (guest-capacity ?ecap) (budget ?ebudget))
  (vendor (id ?vid) (location ?vloc&?eloc) (service-type "catering") (availability $?avails) (cost ?vcost) (capacity ?vcap) (customer-ratings ?vrating))
  (test (member$ "catering" $?eservices))
  (test (member$ ?edate $?avails)) ; Ensure the date is within availability
  (test (>= ?vrating 4.0))  ; Ensure vendor has good ratings
  (test (<= ?vcost ?ebudget))  ; Ensure cost is within the budget
  (test (>= ?vcap ?ecap))  ; Ensure capacity meets the requirement
  =>
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type "catering")))
  (printout t "Event " ?eid " matches Catering Vendor " ?vid crlf))

; Rule to match entertainment
(defrule match-entertainment
  (event (id ?eid) (location ?eloc) (service-requirements $?eservices) (date ?edate) (guest-capacity ?ecap) (budget ?ebudget))
  (vendor (id ?vid) (location ?vloc&?eloc) (service-type "entertainment") (availability $?avails) (cost ?vcost) (capacity ?vcap) (customer-ratings ?vrating))
  (test (member$ "entertainment" $?eservices))
  (test (member$ ?edate $?avails)) ; Ensure the date is within availability
  (test (>= ?vrating 4.0))  ; Ensure vendor has good ratings
  (test (<= ?vcost ?ebudget))  ; Ensure cost is within the budget
  (test (>= ?vcap ?ecap))  ; Ensure capacity meets the requirement
  =>
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type "entertainment")))
  (printout t "Event " ?eid " matches Entertainment Vendor " ?vid crlf))

; Rule to match decoration
(defrule match-decoration
  (event (id ?eid) (location ?eloc) (service-requirements $?eservices) (date ?edate) (guest-capacity ?ecap) (budget ?ebudget))
  (vendor (id ?vid) (location ?vloc&?eloc) (service-type "decoration") (availability $?avails) (cost ?vcost) (capacity ?vcap) (customer-ratings ?vrating))
  (test (member$ "decoration" $?eservices))
  (test (member$ ?edate $?avails)) ; Ensure the date is within availability
  (test (>= ?vrating 4.0))  ; Ensure vendor has good ratings
  (test (<= ?vcost ?ebudget))  ; Ensure cost is within the budget
  (test (>= ?vcap ?ecap))  ; Ensure capacity meets the requirement
  =>
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type "decoration")))
  (printout t "Event " ?eid " matches Decoration Vendor " ?vid crlf))

; Rule to match photo and video
(defrule match-photo-video
  (event (id ?eid) (location ?eloc) (service-requirements $?eservices) (date ?edate) (guest-capacity ?ecap) (budget ?ebudget))
  (vendor (id ?vid) (location ?vloc&?eloc) (service-type "photo-video") (availability $?avails) (cost ?vcost) (capacity ?vcap) (customer-ratings ?vrating))
  (test (member$ "photo-video" $?eservices))
  (test (member$ ?edate $?avails)) ; Ensure the date is within availability
  (test (>= ?vrating 4.0))  ; Ensure vendor has good ratings
  (test (<= ?vcost ?ebudget))  ; Ensure cost is within the budget
  (test (>= ?vcap ?ecap))  ; Ensure capacity meets the requirement
  =>
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type "photo-video")))
  (printout t "Event " ?eid " matches Photo-Video Vendor " ?vid crlf))

; Rule to print all matches
(defrule print-matches
  (match (event-id ?eid) (vendor-id ?vid) (service-type ?stype))
  =>
  (printout t "Match found: Event " ?eid " with Vendor " ?vid " for " ?stype crlf))

; Rule to prioritize services based on ranking
(defrule prioritize-services
  ?event <- (event (id ?eid) (priority-ranking $?priorities) (service-requirements $?eservices))
  ?vendor <- (vendor (id ?vid) (service-type ?stype) (availability $?avails))
  (test (member$ ?stype $?priorities))
  =>
  (retract ?event)
  (bind ?pos (position$ ?stype $?priorities))
  (bind ?new-priorities (delete$ ?pos 1 $?priorities))
  (assert (event (id ?eid) (priority-ranking ?new-priorities) (service-requirements $?eservices)))
  (assert (match (event-id ?eid) (vendor-id ?vid) (service-type ?stype)))
  (printout t "Prioritized match for Event " ?eid ": Vendor " ?vid " for " ?stype crlf))

(deffacts test-case-1
  (event (id 2) (type "Quinceañera") (date "2025-06-15") (location "San Luis Obispo")
         (guest-capacity 100) (budget 3000)
         (service-requirements "venue" "catering" "entertainment" "decoration")
         (priority-ranking "venue" "catering" "entertainment" "decoration"))
  (vendor (id 201) (name "Quince Venues") (location "San Luis Obispo") (service-type "venue")
          (availability "2025-06-15") (cost 1000) (capacity 150) (range 10) (customer-ratings 4.5))
  (vendor (id 202) (name "Fiesta Catering") (location "San Luis Obispo") (service-type "catering")
          (availability "2025-06-15") (cost 800) (capacity 100) (range 10) (customer-ratings 4.7))
  (vendor (id 203) (name "Party DJs") (location "San Luis Obispo") (service-type "entertainment")
          (availability "2025-06-15") (cost 600) (capacity 100) (range 15) (customer-ratings 4.8))
  (vendor (id 204) (name "Beautiful Decor") (location "San Luis Obispo") (service-type "decoration")
          (availability "2025-06-15") (cost 400) (capacity 100) (range 10) (customer-ratings 4.9)))